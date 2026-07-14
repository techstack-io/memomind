from fastapi import APIRouter

from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
)

from app.services.conversation_service import create_reply

router = APIRouter()


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello from MemoMind"}


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post(
    "/conversations",
    response_model=ConversationResponse,
)
async def conversation(
    request: ConversationRequest,
) -> ConversationResponse:
    return create_reply(request)