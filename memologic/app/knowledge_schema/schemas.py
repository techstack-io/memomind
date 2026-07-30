"""Validate a knowledge-base Markdown file's frontmatter.

This schema checks retrieval tags against the shared taxonomy before an
entry is embedded or written to the database.
"""

from pydantic import BaseModel, Field

from app.knowledge_schema.taxonomy import (
    ContextTag,
    CorePrincipleTag,
    EmotionTag,
    MindTrainingPoint,
    PatternTag,
)


class RetrievalSignals(BaseModel):
    emotions: list[EmotionTag] = Field(default_factory=list)
    patterns: list[PatternTag] = Field(default_factory=list)
    contexts: list[ContextTag] = Field(default_factory=list)


class ReflectionFrontmatter(BaseModel):
    id: str
    title: str
    difficulty: str
    retrieval_summary: str

    slogan_number: int | None = Field(
        default=None,
        ge=1,
        le=59,
    )
    point: MindTrainingPoint | None = None

    retrieval_signals: RetrievalSignals
    core_principles: list[CorePrincipleTag] = Field(default_factory=list)