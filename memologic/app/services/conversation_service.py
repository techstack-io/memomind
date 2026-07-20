from langchain_openai import ChatOpenAI

from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
)
from app.services.safety import SAFETY_RESPONSE, check_safety
from app.settings import get_settings

settings = get_settings()

model = ChatOpenAI(
    model=settings.openai_model,
    api_key=settings.openai_api_key,
)

SYSTEM_PROMPT = (
    "You are Memo, a thoughtful AI companion in the MemoMind application. "
    "Respond warmly, clearly, and concisely. "
    "Do not claim to remember information unless it was provided "
    "in the current conversation."
)


async def create_reply(
    request: ConversationRequest,
) -> ConversationResponse:
    # Safety is a hard override. If the message is flagged, no model,
    # retrieval, memory, or contemplative reasoning should run.
    # check_safety() runs the regex layer first (free, instant), then the
    # Moderation API only if regex didn't already flag it. See safety.py
    # for the fail-open behavior if the Moderation API call itself fails.
    flagged, matched = await check_safety(request.message)

    if flagged:
        # TODO: record `matched` in structured safety telemetry.
        return ConversationResponse(reply=SAFETY_RESPONSE)

    try:
        result = await model.ainvoke(
            [
                ("system", SYSTEM_PROMPT),
                ("human", request.message),
            ]
        )
    except Exception:
        # Log the exception internally without exposing provider details.
        return ConversationResponse(
            reply=(
                "I'm having trouble responding right now. "
                "Please try again in a moment."
            )
        )

    content = result.content

    if not isinstance(content, str):
        content = str(content)

    return ConversationResponse(reply=content)