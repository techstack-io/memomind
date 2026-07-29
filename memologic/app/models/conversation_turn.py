"""SQLAlchemy model for a single conversation turn -- a raw, unprocessed
log of one message/reply exchange. This is the episodic transcript layer
only: it remembers *that* something was said, not what's durable or
worth extracting from it. That extraction/synthesis layer is a separate,
deliberately deferred concern (see memory.py, currently empty).

Populated by conversation_service.create_reply() after each successful
model call. Also used to load recent history back into future calls.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ConversationTurn(Base):
    __tablename__ = "conversation_turns"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String, index=True)

    message: Mapped[str] = mapped_column(Text)
    reply: Mapped[str] = mapped_column(Text)

    # Which reflection entry (if any) was surfaced by retrieval and fed
    # into the system prompt for this turn -- nullable since retrieval
    # can legitimately find nothing, or fail and fall back silently.
    reflection_entry_id: Mapped[str | None] = mapped_column(
        ForeignKey("reflection_entries.id"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Soft delete -- lets a user's history be removed without a
    # destructive DB operation, and without building full export/delete
    # flows yet. Null means not deleted.
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )