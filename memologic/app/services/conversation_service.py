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

BASE_SYSTEM_PROMPT = (
    "You are Ana, a thoughtful AI companion in the Mettavia application. "
    "Respond warmly, clearly, and concisely. "
    "Do not claim to remember information unless it was provided "
    "in the current conversation."
)

SIMILARITY_WEIGHT = 0.7
TAG_OVERLAP_WEIGHT = 0.3

HISTORY_TURN_LIMIT = 8


def rank_reflection(
    candidates: list[RetrievalCandidate],
) -> RetrievalCandidate | None:
    if not candidates:
        return None

    best = None
    best_score = float("-inf")

    for candidate in candidates:
        tag_count = (
            len(candidate.emotions)
            + len(candidate.patterns)
            + len(candidate.contexts)
            + len(candidate.core_principles)
        )
        tag_score = min(tag_count / 12, 1.0)

        score = (
            SIMILARITY_WEIGHT * candidate.similarity
            + TAG_OVERLAP_WEIGHT * tag_score
        )

        if score > best_score:
            best_score = score
            best = candidate

    return best


def build_system_prompt(entry: RetrievalCandidate | None) -> str:
    if entry is None:
        return BASE_SYSTEM_PROMPT

    return (
        f"{BASE_SYSTEM_PROMPT}\n\n"
        f"The following teaching may be relevant to this conversation. "
        f"Draw on it naturally if it fits what the person is describing "
        f"-- don't force it, and don't mention that you were given "
        f"reference material.\n\n"
        f"Title: {entry.title}\n\n"
        f"Interpretation:\n{entry.memo_interpretation}\n\n"
        f"Conversation guidance:\n{entry.conversation_guidance}\n\n"
        + (f"Safety notes:\n{entry.safety}\n" if entry.safety else "")
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
