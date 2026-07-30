"""Ingest knowledge-base .md files into Postgres.

Walks knowledge/reflections/<tradition>/<id>.md, validates each file's
frontmatter against ReflectionFrontmatter, embeds the reflection content
and retrieval metadata via OpenAI's text-embedding-3-small, and upserts
rows into reflection_entries and reflection_embeddings.

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

client = AsyncOpenAI(
    api_key=settings.openai_api_key,
)

KNOWLEDGE_ROOT = (
    Path(__file__).resolve().parent.parent
    / "knowledge"
    / "reflections"
)

EMBEDDING_MODEL = "text-embedding-3-small"


def split_sections(body: str) -> dict[str, str]:
    """Split the Markdown body into sections based on ## headings."""

    sections: dict[str, str] = {}
    current_heading: str | None = None
    current_lines: list[str] = []

    for line in body.splitlines():
        if line.startswith("## "):
            if current_heading is not None:
                sections[current_heading] = "\n".join(
                    current_lines
                ).strip()

            current_heading = line[3:].strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_heading is not None:
        sections[current_heading] = "\n".join(
            current_lines
        ).strip()

    return sections


def normalize_metadata_value(value: object) -> str:
    """Convert an enum or string metadata value into embedding-friendly text."""

    raw_value = getattr(value, "value", value)

    return str(raw_value).replace("_", " ").strip()


def build_embedding_text(
    parsed: ReflectionFrontmatter,
    body: str,
) -> str:
    """Build the complete text used to create the reflection embedding."""

    core_principles = ", ".join(
        normalize_metadata_value(principle)
        for principle in parsed.core_principles
    )

    emotions = ", ".join(
        normalize_metadata_value(emotion)
        for emotion in parsed.retrieval_signals.emotions
    )

    patterns = ", ".join(
        normalize_metadata_value(pattern)
        for pattern in parsed.retrieval_signals.patterns
    )

    contexts = ", ".join(
        normalize_metadata_value(context)
        for context in parsed.retrieval_signals.contexts
    )

    slogan_number = getattr(parsed, "slogan_number", None)
    point = getattr(parsed, "point", None)

    point_text = (
        normalize_metadata_value(point)
        if point is not None
        else ""
    )

    return "\n".join(
        [
            f"Title: {parsed.title}",
            f"Slogan number: {slogan_number or ''}",
            f"Point: {point_text}",
            f"Core principles: {core_principles}",
            f"Emotions: {emotions}",
            f"Patterns: {patterns}",
            f"Contexts: {contexts}",
            "",
            body.strip(),
        ]
    )


async def embed(text: str) -> list[float]:
    """Create an embedding for the supplied text."""

    response = await client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )

    return response.data[0].embedding


async def ingest_file(path: Path) -> None:
    """Validate, embed, and upsert one reflection Markdown file."""

    post = frontmatter.load(path)

    try:
        parsed = ReflectionFrontmatter(**post.metadata)
    except ValidationError as exc:
        logger.warning(
            "Skipping %s -- frontmatter invalid: %s",
            path.name,
            exc,
        )
        return

    sections = split_sections(post.content)

    memo_interpretation = sections.get(
        "Memo Interpretation",
        "",
    )

    conversation_guidance = sections.get(
        "Conversation Guidance",
        "",
    )

    safety = sections.get("Safety")

    if safety and safety.strip().upper().startswith("_TODO"):
        safety = None

    if not memo_interpretation or not conversation_guidance:
        logger.warning(
            "Skipping %s -- missing Memo Interpretation "
            "or Conversation Guidance",
            path.name,
        )
        return

    embedding_text = build_embedding_text(
        parsed=parsed,
        body=post.content,
    )

    embedding_vector = await embed(embedding_text)

    slogan_number = getattr(parsed, "slogan_number", None)
    point = getattr(parsed, "point", None)

    point_value = (
        getattr(point, "value", point)
        if point is not None
        else None
    )

    emotions = [
        getattr(emotion, "value", emotion)
        for emotion in parsed.retrieval_signals.emotions
    ]

    patterns = [
        getattr(pattern, "value", pattern)
        for pattern in parsed.retrieval_signals.patterns
    ]

    contexts = [
        getattr(context, "value", context)
        for context in parsed.retrieval_signals.contexts
    ]

    core_principles = [
        getattr(principle, "value", principle)
        for principle in parsed.core_principles
    ]

    async with AsyncSessionLocal() as session:
        entry_stmt = pg_insert(ReflectionEntry).values(
            id=parsed.id,
            slogan_number=slogan_number,
            title=parsed.title,
            point=point_value,
            difficulty=parsed.difficulty,
            emotions=emotions,
            patterns=patterns,
            contexts=contexts,
            core_principles=core_principles,
            memo_interpretation=memo_interpretation,
            conversation_guidance=conversation_guidance,
            safety=safety,
        )

        entry_stmt = entry_stmt.on_conflict_do_update(
            index_elements=["id"],
            set_={
                "slogan_number": entry_stmt.excluded.slogan_number,
                "title": entry_stmt.excluded.title,
                "point": entry_stmt.excluded.point,
                "difficulty": entry_stmt.excluded.difficulty,
                "emotions": entry_stmt.excluded.emotions,
                "patterns": entry_stmt.excluded.patterns,
                "contexts": entry_stmt.excluded.contexts,
                "core_principles": (
                    entry_stmt.excluded.core_principles
                ),
                "memo_interpretation": (
                    entry_stmt.excluded.memo_interpretation
                ),
                "conversation_guidance": (
                    entry_stmt.excluded.conversation_guidance
                ),
                "safety": entry_stmt.excluded.safety,
            },
        )

        await session.execute(entry_stmt)

        embedding_stmt = pg_insert(
            ReflectionEmbedding
        ).values(
            entry_id=parsed.id,
            embedding=embedding_vector,
        )

        embedding_stmt = embedding_stmt.on_conflict_do_update(
            index_elements=["entry_id"],
            set_={
                "embedding": embedding_stmt.excluded.embedding,
            },
        )

        await session.execute(embedding_stmt)
        await session.commit()

    logger.info("Ingested %s", parsed.id)


async def main() -> None:
    """Ingest every reflection Markdown file."""

    md_files = sorted(
        KNOWLEDGE_ROOT.rglob("*.md")
    )

    if not md_files:
        logger.warning(
            "No .md files found under %s",
            KNOWLEDGE_ROOT,
        )
        return

    for path in md_files:
        try:
            await ingest_file(path)
        except Exception:
            logger.exception(
                "Failed to ingest %s",
                path,
            )
            raise


if __name__ == "__main__":
    asyncio.run(main())