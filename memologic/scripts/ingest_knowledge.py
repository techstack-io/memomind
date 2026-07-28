"""Ingest knowledge-base .md files into Postgres.

Walks memologic/knowledge/wisdom/<tradition>/<id>.md, validates each
file's frontmatter against ReflectionFrontmatter, embeds the body text
via OpenAI's text-embedding-3-small, and upserts a row into
reflection_entries + reflection_embeddings for each valid file.

Usage:
    uv run python -m scripts.ingest_knowledge
"""

import asyncio
import logging
from pathlib import Path

import frontmatter
from openai import AsyncOpenAI
from pydantic import ValidationError
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.knowledge_schema.schemas import ReflectionFrontmatter
from app.models.base import AsyncSessionLocal
from app.models.reflection_embedding import ReflectionEmbedding
from app.models.reflection_entry import ReflectionEntry
from app.settings import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

KNOWLEDGE_ROOT = Path(__file__).resolve().parent.parent / "knowledge" / "wisdom"
EMBEDDING_MODEL = "text-embedding-3-small"


def split_sections(body: str) -> dict[str, str]:
    """Split the markdown body into its ## sections by heading."""
    sections: dict[str, str] = {}
    current = None
    lines: list[str] = []
    for line in body.splitlines():
        if line.startswith("## "):
            if current:
                sections[current] = "\n".join(lines).strip()
            current = line[3:].strip()
            lines = []
        else:
            lines.append(line)
    if current:
        sections[current] = "\n".join(lines).strip()
    return sections


async def embed(text: str) -> list[float]:
    response = await client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


async def ingest_file(path: Path) -> None:
    post = frontmatter.load(path)

    try:
        parsed = ReflectionFrontmatter(**post.metadata)
    except ValidationError as exc:
        logger.warning("Skipping %s -- frontmatter invalid: %s", path.name, exc)
        return

    sections = split_sections(post.content)
    memo_interpretation = sections.get("Memo Interpretation", "")
    conversation_guidance = sections.get("Conversation Guidance", "")
    safety = sections.get("Safety")

    if safety and safety.strip().upper().startswith("_TODO"):
        safety = None

    if not memo_interpretation or not conversation_guidance:
        logger.warning(
            "Skipping %s -- missing Memo Interpretation or Conversation Guidance",
            path.name,
        )
        return

    embedding_vector = await embed(post.content)

    async with AsyncSessionLocal() as session:
        entry_stmt = pg_insert(ReflectionEntry).values(
            id=parsed.id,
            title=parsed.title,
            difficulty=parsed.difficulty,
            emotions=[e.value for e in parsed.retrieval_signals.emotions],
            patterns=[p.value for p in parsed.retrieval_signals.patterns],
            contexts=[c.value for c in parsed.retrieval_signals.contexts],
            core_principles=[cp.value for cp in parsed.core_principles],
            memo_interpretation=memo_interpretation,
            conversation_guidance=conversation_guidance,
            safety=safety,
        )
        entry_stmt = entry_stmt.on_conflict_do_update(
            index_elements=["id"],
            set_={
                "title": entry_stmt.excluded.title,
                "difficulty": entry_stmt.excluded.difficulty,
                "emotions": entry_stmt.excluded.emotions,
                "patterns": entry_stmt.excluded.patterns,
                "contexts": entry_stmt.excluded.contexts,
                "core_principles": entry_stmt.excluded.core_principles,
                "memo_interpretation": entry_stmt.excluded.memo_interpretation,
                "conversation_guidance": entry_stmt.excluded.conversation_guidance,
                "safety": entry_stmt.excluded.safety,
            },
        )
        await session.execute(entry_stmt)

        embedding_stmt = pg_insert(ReflectionEmbedding).values(
            entry_id=parsed.id,
            embedding=embedding_vector,
        )
        embedding_stmt = embedding_stmt.on_conflict_do_update(
            index_elements=["entry_id"],
            set_={"embedding": embedding_stmt.excluded.embedding},
        )
        await session.execute(embedding_stmt)

        await session.commit()

    logger.info("Ingested %s", parsed.id)


async def main() -> None:
    md_files = sorted(KNOWLEDGE_ROOT.rglob("*.md"))
    if not md_files:
        logger.warning("No .md files found under %s", KNOWLEDGE_ROOT)
        return

    for path in md_files:
        await ingest_file(path)


if __name__ == "__main__":
    asyncio.run(main())