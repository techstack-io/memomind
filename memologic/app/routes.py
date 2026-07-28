from fastapi import APIRouter, Depends

from app.auth import get_current_user_id
from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
)

from app.services.conversation_service import create_reply

router = APIRouter()


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello from Mettavia"}


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post(
    "/conversations",
    response_model=ConversationResponse,
)
async def conversation(
    request: ConversationRequest,
    user_id: str = Depends(get_current_user_id),
) -> ConversationResponse:
    return await create_reply(request, user_id)