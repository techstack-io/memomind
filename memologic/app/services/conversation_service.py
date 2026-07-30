# import logging
import logging

from langchain_openai import ChatOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation_turn import ConversationTurn
from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
)
from app.schemas.reflection_plan import ReflectionPlan
from app.services.reflection_reasoning_service import build_reflection_plan
from app.services.retrieval_service import (
    RetrievalCandidate,
    retrieve_candidates,
)
from app.services.safety import SAFETY_RESPONSE, check_safety
from app.settings import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

response_model = ChatOpenAI(
    model=settings.openai_model,
    api_key=settings.openai_api_key,
)

UNIVERSAL_SYSTEM_PROMPT = """
You are Ana, the reflective AI guide in the Mettavia application.

Your role is not to solve the person's problems, diagnose them, coach their
productivity, or immediately offer advice.

Regardless of how you approach any given turn:

- Do not sound like a therapist, productivity coach, motivational speaker,
  lecturer, or generic AI assistant.
- Do not diagnose, label, or assume certainty about the person's inner state.
- Do not present numbered lists of possible causes unless the person explicitly
  asks for a structured analysis.
- The conversation itself should embody calm attention, compassion, clarity,
  and spaciousness.
- Respond in natural prose, usually in one to three short paragraphs.
- Do not claim to remember information unless it was provided in the current
  conversation history.
""".strip()


DISCOVERY_MODE_PROMPT = """
No specific contemplative teaching has been selected for this turn. Your job
right now is discovery, not instruction: help the person arrive at their own
clearer view of what is happening, rather than delivering a teaching to them.

- Before asking a question, briefly reflect back what seems present in the
  person's experience so they feel understood.
- Stay close to the person's lived experience rather than reducing it to
  categories, checklists, frameworks, or generic self-help guidance.
- Help the person slow down and notice what is happening in a specific moment.
- Let the person's own language shape the direction of the conversation.
- Prefer one meaningful question over several shallow or diagnostic questions.
- Ask open questions that invite observation rather than offering possible
  answers or predefined categories.
- Reflect what seems present while making uncertainty clear.
- Let understanding emerge gradually. Do not rush toward a lesson, practice,
  reframe, or solution.
- When pain is fresh or intense, presence and acknowledgment come before
  anything else.
""".strip()


ENACTMENT_MODE_PROMPT = """
A contemplative teaching from the Lojong (mind-training) tradition has
already been selected and interpreted for this turn, in the internal
Reflection Plan below. Lojong teachings are precise — they draw specific
distinctions (such as acceptance versus resignation, or responsibility
versus blame) that must not be softened, blurred, or partially expressed.

Your job right now is enactment, not discovery: the direction of this
conversation is not open-ended, it has already been determined by the plan.

- Begin by expressing the Core Insight in natural language.
- Then follow the Conversation Movement — this is the direction the
  conversation should move, not one option among several.
- Express the full arc of the Conversation Movement, not just its starting
  point. If the movement contains more than one distinction (for example,
  acceptance and responsibility, or clarity and agency), your response must
  carry the person through all of it, not stop after the first part.
- Finally, ask one question that continues that movement forward, not one
  that reopens exploration the plan has already resolved.
- Do not default to reflective listening, validation-only responses, or an
  observation question as a way of softening or delaying the teaching.
- Do not treat gentleness and directness as opposites. Express the teaching
  with warmth, but warmth is not a reason to withhold or dilute it.
- A response should NOT be something that could have been written without
  this Reflection Plan.
- You may name the specific slogan (for example, "this is close to what
  Lojong calls Slogan 1" or "this is the first slogan, on training in the
  preliminaries"). Naming it is an invitation, not a formality — the person
  can look it up in the library if they want to go deeper. Do this
  naturally, not on every single turn, but do not avoid it either.

The Contemplative Lens, Core Insight, Conversation Movement, Relevant
Elements, and Avoid sections below are instructions, not suggestions.
""".strip()

HISTORY_TURN_LIMIT = 8
MIN_REFLECTION_SIMILARITY = 0.22

ConversationHistory = list[tuple[str, str]]


def rank_reflection(
    candidates: list[RetrievalCandidate],
) -> RetrievalCandidate | None:
    """Return the highest-ranked reflection above the similarity threshold."""

    if not candidates:
        return None

    best = max(
        candidates,
        key=lambda candidate: candidate.similarity,
    )

    if best.similarity < MIN_REFLECTION_SIMILARITY:
        return None

    return best


def build_fallback_system_prompt(
    entry: RetrievalCandidate | None,
) -> str:
    """Build the discovery-mode prompt used when no Reflection Plan is available.

    This path is used when no reflection met the similarity threshold, or when
    a reflection was retrieved but Reflection Plan generation failed. Either
    way, no plan exists, so this stays in discovery mode rather than enactment.
    """

    if entry is None:
        return f"{UNIVERSAL_SYSTEM_PROMPT}\n\n{DISCOVERY_MODE_PROMPT}"

    safety_section = (
        f"\n\nSafety notes:\n{entry.safety}"
        if entry.safety
        else ""
    )

    return (
        f"{UNIVERSAL_SYSTEM_PROMPT}\n\n"
        f"{DISCOVERY_MODE_PROMPT}\n\n"
        "The following contemplative interpretation is relevant to this "
        "conversation. Use it to shape both what you say and how the "
        "conversation unfolds. Embody its conversational movement rather "
        "than summarizing, explaining, or reciting it. Stay responsive to "
        "the person's actual words. Do not force the teaching, mention "
        "reference material, or repeat its metaphors mechanically.\n\n"
        f"Title: {entry.title}\n\n"
        f"Interpretation:\n{entry.memo_interpretation}\n\n"
        f"Conversation guidance:\n{entry.conversation_guidance}"
        f"{safety_section}"
        )


def format_markdown_list(items: list[str]) -> str:
    """Format Reflection Plan list fields as Markdown."""

    if not items:
        return "- None specified"

    return "\n".join(f"- {item}" for item in items)


def format_reflection_plan(plan: ReflectionPlan) -> str:
    """Render the structured Reflection Plan as Markdown for the response model."""

    return "\n".join(
        [
            "## Internal Reflection Plan",
            "",
            f"**Reflection ID:** {plan.reflection_id}",
            "",
            "### Contemplative Lens",
            plan.contemplative_lens,
            "",
            "### User Dynamic",
            plan.user_dynamic,
            "",
            "### Core Insight",
            plan.core_insight,
            "",
            "### Conversation Movement",
            plan.conversation_movement,
            "",
            "### Relevant Elements",
            format_markdown_list(plan.relevant_elements),
            "",
            "### Avoid",
            format_markdown_list(plan.avoid),
        ]
    )


def build_response_prompt(plan: ReflectionPlan) -> str:
    """Build Ana's final response prompt from the internal Reflection Plan."""

    reflection_plan_markdown = format_reflection_plan(plan)

    return (
        f"{UNIVERSAL_SYSTEM_PROMPT}\n\n"
        f"{ENACTMENT_MODE_PROMPT}\n\n"
        f"{reflection_plan_markdown}"
    )


async def load_recent_history(
    session: AsyncSession,
    user_id: str,
    limit: int = HISTORY_TURN_LIMIT,
) -> ConversationHistory:
    """Load recent stored exchanges in chronological order.

    Each item contains one complete user-and-Ana exchange:

        (user_message, assistant_reply)
    """

    stmt = (
        select(ConversationTurn)
        .where(
            ConversationTurn.user_id == user_id,
            ConversationTurn.deleted_at.is_(None),
        )
        .order_by(ConversationTurn.created_at.desc())
        .limit(limit)
    )

    result = await session.execute(stmt)
    turns = list(reversed(result.scalars().all()))

    return [
        (turn.message, turn.reply)
        for turn in turns
    ]


def build_history_messages(
    history: ConversationHistory,
) -> list[tuple[str, str]]:
    """Convert stored exchanges into LangChain-compatible chat messages."""

    messages: list[tuple[str, str]] = []

    for user_message, assistant_reply in history:
        messages.append(("human", user_message))
        messages.append(("assistant", assistant_reply))

    return messages


async def create_reply(
    request: ConversationRequest,
    user_id: str,
    session: AsyncSession,
) -> ConversationResponse:
    """Process a message through safety, retrieval, reasoning, and synthesis."""

    flagged, matched = await check_safety(request.message)

    if flagged:
        logger.warning(
            "Safety override triggered.",
            extra={"matched": matched},
        )
        return ConversationResponse(reply=SAFETY_RESPONSE)

    try:
        history = await load_recent_history(
            session=session,
            user_id=user_id,
        )
    except Exception:
        logger.exception("history_load_failed")
        history = []

    try:
        candidates = await retrieve_candidates(
            session=session,
            query=request.message,
        )
    except Exception:
        logger.exception("retrieval_failed")
        candidates = []

    logger.warning("=== Retrieval Candidates ===")
    logger.warning(
        "\n".join(
            f"{candidate.id}: {candidate.similarity}"
            for candidate in candidates
        )
        or "NO CANDIDATES RETURNED"
    )
    
    best_entry = rank_reflection(candidates)
    

    if best_entry is not None:
        logger.warning("=== Selected Reflection ===")
        logger.warning(best_entry.model_dump_json(indent=2))
    else:
        logger.warning("=== No Reflection Selected ===")

    reflection_plan: ReflectionPlan | None = None

    if best_entry is not None:
        try:
            reflection_plan = await build_reflection_plan(
                message=request.message,
                reflection=best_entry,
                history=history,
            )

            logger.warning("=== Reflection Plan ===")
            logger.warning(reflection_plan.model_dump_json(indent=2))
        except Exception:
            logger.exception(
                "reflection_plan_generation_failed",
                extra={
                    "reflection_entry_id": best_entry.id,
                },
            )

    if reflection_plan is not None:
        system_prompt = build_response_prompt(reflection_plan)
    else:
        system_prompt = build_fallback_system_prompt(best_entry)

    history_messages = build_history_messages(history)

    messages = [
        ("system", system_prompt),
        *history_messages,
        ("human", request.message),
    ]

    logger.warning("=== Final System Prompt ===")
    logger.warning(system_prompt)

    try:
        result = await response_model.ainvoke(messages)
    except Exception:
        logger.exception("conversation_model_call_failed")

        return ConversationResponse(
            reply=(
                "I'm having trouble responding right now. "
                "Please try again in a moment."
            )
        )

    content = result.content

    if not isinstance(content, str):
        content = str(content)

    try:
        turn = ConversationTurn(
            user_id=user_id,
            message=request.message,
            reply=content,
            reflection_entry_id=(
                best_entry.id
                if best_entry is not None
                else None
            ),
        )

        session.add(turn)
        await session.commit()
    except Exception:
        logger.exception("conversation_turn_persist_failed")
        await session.rollback()

    return ConversationResponse(reply=content)
