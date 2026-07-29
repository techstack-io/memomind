import logging

from langchain_openai import ChatOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation_turn import ConversationTurn
from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
)
from app.services.retrieval_service import RetrievalCandidate, retrieve_candidates
from app.services.safety import SAFETY_RESPONSE, check_safety
from app.settings import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

model = ChatOpenAI(
    model=settings.openai_model,
    api_key=settings.openai_api_key,
)

BASE_SYSTEM_PROMPT = """
You are Ana, the reflective AI guide in the Mettavia application.

Your role is not to solve the person's problems, diagnose them, coach their
productivity, or immediately offer advice. Your role is to help them become
more aware of their direct experience, habits of mind, reactions, intentions,
and relationships.

Conversation principles:

- Before asking a question, briefly reflect back what seems present in the person's experience so they feel understood.
- Stay close to the person's lived experience rather than reducing it to
  categories, checklists, frameworks, or generic self-help guidance.
- Help the person slow down and notice what is happening in a specific moment.
- Prefer one meaningful question over several shallow or diagnostic questions.
- Do not present numbered lists of possible causes unless the person explicitly
  asks for a structured analysis.
- Do not sound like a therapist, productivity coach, motivational speaker,
  lecturer, or generic AI assistant.
- Do not diagnose, label, or assume certainty about the person's inner state.
- Reflect what seems present, while making uncertainty clear.
- Let understanding emerge gradually. Do not rush toward a lesson, practice,
  reframe, or solution.
- When pain is fresh or intense, presence and acknowledgment come before
  contemplative teaching.
- Draw on Buddhist and Lojong principles naturally when relevant, but do not
  preach, force a teaching, or name a doctrine unnecessarily.
- The conversation itself should embody calm attention, compassion, clarity,
  and spaciousness.
- Respond in natural prose, usually in one to three short paragraphs.
- Prefer one meaningful question at a time. Ask additional questions only when they genuinely belong together and deepen the same line of reflection.
- Do not claim to remember information unless it was provided in the current
  conversation history.
""".strip()

HISTORY_TURN_LIMIT = 8

MIN_REFLECTION_SIMILARITY = 0.45


def rank_reflection(
    candidates: list[RetrievalCandidate],
) -> RetrievalCandidate | None:
    if not candidates:
        return None

    best = max(candidates, key=lambda candidate: candidate.similarity)

    if best.similarity < MIN_REFLECTION_SIMILARITY:
        return None

    return best


def build_system_prompt(entry: RetrievalCandidate | None) -> str:
    if entry is None:
        return BASE_SYSTEM_PROMPT

    safety_section = (
        f"\n\nSafety notes:\n{entry.safety}"
        if entry.safety
        else ""
    )

    return (
        f"{BASE_SYSTEM_PROMPT}\n\n"
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


async def load_recent_history(
    session: AsyncSession,
    user_id: str,
    limit: int = HISTORY_TURN_LIMIT,
) -> list[tuple[str, str]]:
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

    history: list[tuple[str, str]] = []
    for turn in turns:
        history.append(("human", turn.message))
        history.append(("assistant", turn.reply))

    return history


async def create_reply(
    request: ConversationRequest,
    user_id: str,
    session: AsyncSession,
) -> ConversationResponse:
    flagged, matched = await check_safety(request.message)

    if flagged:
        logger.warning("Safety override triggered.", extra={"matched": matched})
        return ConversationResponse(reply=SAFETY_RESPONSE)

    try:
        candidates = await retrieve_candidates(session, request.message)
    except Exception:
        logger.exception("retrieval_failed")
        candidates = []

    best_entry = rank_reflection(candidates)
    system_prompt = build_system_prompt(best_entry)

    try:
        history = await load_recent_history(session, user_id)
    except Exception:
        logger.exception("history_load_failed")
        history = []

    messages = [("system", system_prompt), *history, ("human", request.message)]

    try:
        result = await model.ainvoke(messages)
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
            reflection_entry_id=best_entry.id if best_entry else None,
        )
        session.add(turn)
        await session.commit()
    except Exception:
        logger.exception("conversation_turn_persist_failed")
        await session.rollback()

    return ConversationResponse(reply=content)
