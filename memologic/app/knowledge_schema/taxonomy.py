"""Shared, enforced vocabulary for Reflection Object retrieval_signals.

Every knowledge-base .md file's frontmatter must draw its emotions,
patterns, contexts, and core_principles from these enums -- not free text.
This is what keeps embedding-based retrieval reliable as more traditions
and entries are authored: without a shared vocabulary, near-synonyms
(feeling_stuck vs. stuck vs. feeling_trapped) silently fragment retrieval
quality.

Seeded from lojong-001's existing tags. Adding a new tag is a deliberate
edit here, not something any slogan file can invent on its own -- that's
the point.
"""

from enum import StrEnum


class EmotionTag(StrEnum):
    OVERWHELMED = "overwhelmed"
    DISCOURAGED = "discouraged"
    UNCERTAIN = "uncertain"
    HELPLESS = "helpless"


class PatternTag(StrEnum):
    CATASTROPHIZING = "catastrophizing"
    EXTERNAL_BLAME = "external_blame"
    SELF_PITY = "self_pity"
    FEELING_STUCK = "feeling_stuck"


class ContextTag(StrEnum):
    WORK = "work"
    RELATIONSHIPS = "relationships"
    HEALTH = "health"
    MAJOR_LIFE_TRANSITION = "major_life_transition"


class CorePrincipleTag(StrEnum):
    ACCEPTANCE = "acceptance"
    PERSONAL_AGENCY = "personal_agency"
    IMPERMANENCE = "impermanence"
    HONEST_SELF_REFLECTION = "honest_self_reflection"