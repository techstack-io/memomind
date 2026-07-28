"""Validates a knowledge-base .md file's frontmatter against the shared
taxonomy in taxonomy.py. Intended to be used by the (not yet built) seed
script, and/or a standalone validation script, before a file's tags are
embedded and stored -- catches typos or invented tags at authoring time
rather than letting them silently degrade retrieval later.
"""

from pydantic import BaseModel

from app.knowledge_schema.taxonomy import (
    ContextTag,
    CorePrincipleTag,
    EmotionTag,
    MindTrainingPoint,
    PatternTag,
)


class RetrievalSignals(BaseModel):
    emotions: list[EmotionTag]
    patterns: list[PatternTag]
    contexts: list[ContextTag]


class ReflectionFrontmatter(BaseModel):
    id: str
    title: str
    difficulty: str
    retrieval_signals: RetrievalSignals
    core_principles: list[CorePrincipleTag]
    point: MindTrainingPoint | None = None
