"""SQLAlchemy model for a knowledge-base entry's embedding vector.
One-to-one with ReflectionEntry -- entry_id is the primary key itself,
enforcing the one-embedding-per-entry constraint at the schema level.
Populated by the (not yet built) ingestion script after the entry row
is written, using OpenAI's text-embedding-3-small on the entry's full
combined content (Memo Interpretation + Conversation Guidance + Safety).
"""

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ReflectionEmbedding(Base):
    __tablename__ = "reflection_embeddings"

    entry_id: Mapped[str] = mapped_column(
        ForeignKey("reflection_entries.id"), primary_key=True
    )
    embedding: Mapped[list[float]] = mapped_column(Vector(1536))