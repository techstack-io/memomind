"""SQLAlchemy model for a single knowledge-base entry.

One row is stored per Markdown file under memologic/knowledge/. Entries are
validated against ReflectionFrontmatter before ingestion.
"""

from sqlalchemy import Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ReflectionEntry(Base):
    __tablename__ = "reflection_entries"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    difficulty: Mapped[str] = mapped_column(String)

    emotions: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=list,
    )
    patterns: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=list,
    )
    contexts: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=list,
    )

    core_principles: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=list,
    )

    user_language: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=list,
    )
    related_slogans: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=list,
    )
    growth_direction: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    # Lojong-only metadata. Null for entries from other traditions.
    slogan_number: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    point: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    memo_interpretation: Mapped[str] = mapped_column(Text)
    conversation_guidance: Mapped[str] = mapped_column(Text)
    safety: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )