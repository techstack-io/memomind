from pydantic import BaseModel, Field


class ConversationRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=4000,
        description="The user's message to Memo.",
    )


class FurtherReading(BaseModel):
    """A pointer to the library entry behind Ana's response, if any."""

    id: str
    title: str
    slogan_number: int | None = None


class ConversationResponse(BaseModel):
    reply: str
    further_reading: FurtherReading | None = None