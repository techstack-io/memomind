"""Async SQLAlchemy engine, session, and declarative base.

Single source of truth for DB setup. Every model in this project should
import `Base` from here, and every service that needs a DB session should
use `get_session()` below.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.settings import get_settings

settings = get_settings()

# Neon's connection string is typically postgresql:// — SQLAlchemy's async
# engine needs the asyncpg driver specified explicitly, so we rewrite the
# scheme if needed rather than requiring the env var itself to be correct.
_database_url = settings.database_url
if _database_url.startswith("postgresql://"):
    _database_url = _database_url.replace(
        "postgresql://", "postgresql+asyncpg://", 1
    )

engine = create_async_engine(_database_url, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


class Base(DeclarativeBase):
    pass


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency — yields a session, closes it after the request."""
    async with AsyncSessionLocal() as session:
        yield session