"""SQLAlchemy model for a single knowledge-base entry (e.g. metta-001,
lojong-001). One row per .md file under memologic/knowledge/. Populated
by the (not yet built) ingestion script, validated against
ReflectionFrontmatter in app/knowledge_schema/schemas.py before write.
"""

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ReflectionEntry(Base):
    __tablename__ = "reflection_entries"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    difficulty: Mapped[str] = mapped_column(String)

    # retrieval_signals.{emotions,patterns,contexts} — stored as plain
    # strings (enum .value), validated against taxonomy.py at ingestion
    # time via ReflectionFrontmatter, not re-validated by the DB itself.
    emotions: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    patterns: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    contexts: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    core_principles: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Full prose sections, stored as-is — no further parsing/structure.
    memo_interpretation: Mapped[str] = mapped_column(Text)
    conversation_guidance: Mapped[str] = mapped_column(Text)
    safety: Mapped[str | None] = mapped_column(Text, nullable=True)
    
