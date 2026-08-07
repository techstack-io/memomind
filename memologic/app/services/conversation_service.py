# import logging
import logging

from langchain_openai import ChatOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation_turn import ConversationTurn
from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
    FurtherReading,
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


ENACTMENT_MODE_BASE_PROMPT = """
A contemplative teaching from the Lojong (mind-training) tradition has
already been selected and interpreted for this turn, in the internal
Reflection Plan below. Lojong teachings are precise — they draw specific
distinctions (such as acceptance versus resignation, or responsibility
versus blame) that must not be softened, blurred, or partially expressed.

Your job right now is enactment, not open-ended discovery: the direction of
this conversation is not open-ended, it has already been determined by the
plan. How you deliver it, however, depends on the plan's Pedagogical
Strategy below — follow that strategy's instructions exactly.

- The Reflection Plan is an internal reasoning aid, not a script to reveal.
  Even when the Pedagogical Strategy permits expressing the Core Insight,
  help the person arrive there through what they have actually said or
  noticed in this conversation. The response should feel like a natural
  continuation of the dialogue, not the disclosure of a hidden conclusion.

- Do not default to reflective listening, validation-only responses, or an
  observation question as a way of softening or delaying the teaching when
  the strategy calls for direct delivery.
- Do not treat gentleness and directness as opposites. Express the teaching
  with warmth, but warmth is not a reason to withhold or dilute it.
- Every response must bear the unmistakable imprint of the Reflection Plan.
  If the selected Lojong teaching were removed and the response would still
  read naturally with only superficial edits, then the teaching has not
  been enacted successfully. The user should encounter the distinctive
  perspective of the selected teaching, whether or not the slogan itself
  is explicitly named.
- You may name the specific slogan (for example, "this is close to what
  Lojong calls Slogan 1" or "this is the first slogan, on training in the
  preliminaries"). Naming it is an invitation, not a formality — the person
  can look it up in the library if they want to go deeper. Do this
  naturally, not on every single turn, but do not avoid it either. Never
  narrate the teaching as an object being described ("this is an example
  of the Lojong move of...") — apply it to the person's actual situation
  instead of explaining its shape.
""".strip()


DIRECT_RESPONSE_PROMPT = """
Pedagogical Strategy for this turn: direct_response.

- Begin by expressing the Core Insight in natural language, grounded in the
  person's specific situation, not stated as an abstract principle.
- Then follow the Conversation Movement — express its full arc, not just its
  starting point. If it contains more than one distinction, your response
  must carry the person through all of it, not stop after the first part.
- Finally, ask one question that continues that movement forward, not one
  that reopens exploration the plan has already resolved.
""".strip()


GUIDED_DISCOVERY_PROMPT = """
Pedagogical Strategy for this turn: guided_discovery.

- Do not state the Core Insight yet. The person has not been guided toward
  it through their own noticing.
- Instead, ask one specific, pointed question aimed at surfacing the exact
  pattern or dynamic the Core Insight concerns — grounded in what the
  person actually said, not a generic reflective question.
- The question should make it natural for the person to notice something
  themselves in their next reply. Do not hint at the answer or summarize
  what they're likely to find.
- Keep the turn brief. This is an invitation, not an explanation.
""".strip()


LIVING_INQUIRY_PROMPT = """
Pedagogical Strategy for this turn: living_inquiry.

The primary goal is to help the user discover the Core Insight through
direct observation rather than explanation.

Favor concrete invitations to notice immediate experience over stating
conclusions.

Avoid explicitly stating the Core Insight unless:
- the user has already arrived at it themselves,
- the user directly asks for your interpretation,
- the user has made a meaningful observation and expressing the Core Insight
  would deepen or integrate what they have already discovered,
- or withholding it would meaningfully impede the conversation.

If you do express the Core Insight, offer it tentatively ("I wonder if...",
"Could it be that...") and derive it explicitly from what the user actually
said or noticed during the conversation. Do not simply reveal or restate the
stored Core Insight as though it were an authoritative conclusion.
""".strip()


PEDAGOGICAL_STRATEGY_PROMPTS = {
    "direct_response": DIRECT_RESPONSE_PROMPT,
    "guided_discovery": GUIDED_DISCOVERY_PROMPT,
    "living_inquiry": LIVING_INQUIRY_PROMPT,
}

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
            "### Pedagogical Strategy",
            plan.pedagogical_strategy.value,
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
    strategy_prompt = PEDAGOGICAL_STRATEGY_PROMPTS.get(plan.pedagogical_strategy.value)
    if strategy_prompt is None:
        logger.error("missing_strategy_prompt", extra={"strategy": plan.pedagogical_strategy.value})
        strategy_prompt = DIRECT_RESPONSE_PROMPT  # safe default

    return (
        f"{UNIVERSAL_SYSTEM_PROMPT}\n\n"
        f"{ENACTMENT_MODE_BASE_PROMPT}\n\n"
        f"{strategy_prompt}\n\n"
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

    logger.debug(
        "=== Retrieval Candidates ===\n%s",
        "\n".join(
            f"{candidate.id}: {candidate.similarity}"
            for candidate in candidates
        )
        or "NO CANDIDATES RETURNED",
    )

    best_entry = rank_reflection(candidates)

    if best_entry is not None:
        logger.debug("=== Selected Reflection ===\n%s", best_entry.model_dump_json(indent=2))
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

            logger.debug("=== Reflection Plan ===\n%s", reflection_plan.model_dump_json(indent=2))
            
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

    logger.debug("=== Final System Prompt ===\n%s", system_prompt)

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

    further_reading = None
    if best_entry is not None:
        further_reading = FurtherReading(
            id=best_entry.id,
            title=best_entry.title,
            slogan_number=best_entry.slogan_number,
        )

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

    return ConversationResponse(
        reply=content,
        further_reading=further_reading,
    )