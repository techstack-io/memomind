"""Vector retrieval -- owns all vector math, per the retrieval boundary
we agreed on. Embeds a query, runs a pgvector cosine-similarity search
against reflection_embeddings joined to reflection_entries, and returns
the top-k candidates with a similarity score attached.

Nothing downstream of this module -- including rank_reflection,
reflection_reasoning_service, and conversation_service -- should ever see
a raw embedding. Downstream services receive only lightweight retrieval
candidates containing reflection content, metadata, and similarity.
"""

from dataclasses import dataclass, field

from openai import AsyncOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reflection_embedding import ReflectionEmbedding
from app.models.reflection_entry import ReflectionEntry
from app.settings import get_settings

settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

EMBEDDING_MODEL = "text-embedding-3-small"


@dataclass
class RetrievalCandidate:
    id: str
    title: str
    memo_interpretation: str
    conversation_guidance: str
    safety: str | None
    emotions: list[str] = field(default_factory=list)
    patterns: list[str] = field(default_factory=list)
    contexts: list[str] = field(default_factory=list)
    core_principles: list[str] = field(default_factory=list)
    point: str | None = None
    similarity: float = 0.0


async def embed_query(text: str) -> list[float]:
    """Convert a retrieval query into an embedding vector."""

    response = await client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )

    return response.data[0].embedding


async def retrieve_candidates(
    session: AsyncSession,
    query: str,
    top_k: int = 5,
) -> list[RetrievalCandidate]:
    """Return the reflection entries most similar to the retrieval query.

    The query is embedded and compared with stored reflection embeddings
    using pgvector cosine distance. Similarity is calculated as
    1 - cosine_distance, where 1.0 represents an exact match and values
    closer to 0.0 represent increasingly unrelated entries.
    """

    query_embedding = await embed_query(query)

    distance = ReflectionEmbedding.embedding.cosine_distance(
        query_embedding
    )

    stmt = (
        select(
            ReflectionEntry,
            distance.label("distance"),
        )
        .join(
            ReflectionEmbedding,
            ReflectionEmbedding.entry_id == ReflectionEntry.id,
        )
        .order_by(distance)
        .limit(top_k)
    )

    result = await session.execute(stmt)

    candidates: list[RetrievalCandidate] = []

    for entry, raw_distance in result.all():
        similarity = max(
            0.0,
            min(
                1.0,
                1.0 - float(raw_distance),
            ),
        )

        candidates.append(
            RetrievalCandidate(
                id=entry.id,
                title=entry.title,
                memo_interpretation=entry.memo_interpretation,
                conversation_guidance=entry.conversation_guidance,
                safety=entry.safety,
                emotions=entry.emotions or [],
                patterns=entry.patterns or [],
                contexts=entry.contexts or [],
                core_principles=entry.core_principles or [],
                point=entry.point,
                similarity=similarity,
            )
        )

    return candidates