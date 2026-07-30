"""Vector retrieval service.

Owns all vector math within the retrieval boundary. Embeds a query, runs a
pgvector cosine-similarity search against reflection_embeddings joined to
reflection_entries, and returns the top-k candidates with similarity scores.

Nothing downstream of this module—including rank_reflection,
reflection_reasoning_service, and conversation_service—should receive raw
embeddings. Downstream services receive only RetrievalCandidate objects.
"""

from openai import AsyncOpenAI
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reflection_embedding import ReflectionEmbedding
from app.models.reflection_entry import ReflectionEntry
from app.settings import get_settings

settings = get_settings()

client = AsyncOpenAI(
    api_key=settings.openai_api_key,
)

EMBEDDING_MODEL = "text-embedding-3-small"


class RetrievalCandidate(BaseModel):
    """A reflection entry returned by semantic retrieval."""

    id: str
    slogan_number: int
    title: str
    point: str | None = None
    memo_interpretation: str
    conversation_guidance: str
    core_principles: list[str] = Field(default_factory=list)
    emotions: list[str] = Field(default_factory=list)
    patterns: list[str] = Field(default_factory=list)
    contexts: list[str] = Field(default_factory=list)
    safety: str | None = None
    similarity: float


async def embed_query(text: str) -> list[float]:
    """Create an embedding for the supplied query text."""

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
    """Return the closest reflection entries by cosine similarity.

    Similarity is calculated as 1 minus cosine distance, where 1.0 represents
    an exact semantic match and 0.0 represents an unrelated or orthogonal
    result.
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
                id=str(entry.id),
                slogan_number=entry.slogan_number,
                title=entry.title,
                point=entry.point,
                memo_interpretation=entry.memo_interpretation,
                conversation_guidance=entry.conversation_guidance,
                core_principles=entry.core_principles or [],
                emotions=entry.emotions or [],
                patterns=entry.patterns or [],
                contexts=entry.contexts or [],
                safety=entry.safety,
                similarity=similarity,
            )
        )

    return candidates