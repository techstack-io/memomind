from pydantic import BaseModel, Field

from app.knowledge_schema.taxonomy import (
    ContextTag,
    CorePrincipleTag,
    Difficulty,
    EmotionTag,
    MindTrainingPoint,
    PatternTag,
)


class RetrievalSignals(BaseModel):
    emotions: list[EmotionTag] = Field(default_factory=list)
    patterns: list[PatternTag] = Field(default_factory=list)
    contexts: list[ContextTag] = Field(default_factory=list)


class GrowthDirection(BaseModel):
    from_: list[str] = Field(default_factory=list, alias="from")
    toward: list[str] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class ReflectionFrontmatter(BaseModel):
    id: str
    title: str
    difficulty: Difficulty
    retrieval_summary: str

    slogan_number: int | None = Field(
        default=None,
        ge=1,
        le=59,
    )
    point: MindTrainingPoint | None = None

    retrieval_signals: RetrievalSignals
    core_principles: list[CorePrincipleTag] = Field(default_factory=list)

    user_language: list[str] = Field(default_factory=list)
    related_slogans: list[str] = Field(default_factory=list)
    growth_direction: GrowthDirection | None = None