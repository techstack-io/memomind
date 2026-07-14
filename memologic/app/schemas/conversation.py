from pydantic import BaseModel, Field

class ConversationRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=4000,
        description="The user's message to Memo.",
    )

class ConversationResponse(BaseModel):
    reply: str