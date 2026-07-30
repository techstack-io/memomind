from pydantic import BaseModel, Field


class ReflectionPlan(BaseModel):
    # Which Memo Interpretation was selected
    reflection_id: str

    # The central contemplative perspective for this conversation
    contemplative_lens: str

    # What seems to be happening for the user right now
    user_dynamic: str

    # The insight the reflection brings to this situation
    core_insight: str

    # Where the conversation should move next
    conversation_movement: str

    # Concepts from the teaching that should naturally appear
    relevant_elements: list[str] = Field(default_factory=list)

    # Things Ana should intentionally avoid
    avoid: list[str] = Field(default_factory=list)