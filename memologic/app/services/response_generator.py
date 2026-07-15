from langchain_openai import ChatOpenAI

from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
)
from app.settings import get_settings

settings = get_settings()

model = ChatOpenAI(
    model=settings.openai_model,
    api_key=settings.openai_api_key,
)


async def create_reply(
    request: ConversationRequest,
) -> ConversationResponse:
    result = await model.ainvoke(
        [
            (
                "system",
                "You are Memo, a thoughtful AI companion in the MemoMind application. "
                "Respond warmly, clearly, and concisely. "
                "Do not claim to remember information unless it was provided "
                "in the current conversation.",
            ),
            (
                "human",
                request.message,
            ),
        ]
    )

    return ConversationResponse(
        reply=str(result.content)
    )