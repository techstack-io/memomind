"""Vector retrieval -- owns all vector math, per the retrieval boundary
we agreed on. Embeds a query, runs a pgvector cosine-similarity search
against reflection_embeddings joined to reflection_entries, and returns
the top-k candidates with a similarity score attached.

Nothing downstream of this module (rank_reflection, conversation_service)
should ever see a raw embedding -- only these lightweight candidates.
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
    response = await client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


async def retrieve_candidates(
    session: AsyncSession,
    query: str,
    top_k: int = 5,
) -> list[RetrievalCandidate]:
    """Embed `query` and return the top_k closest reflection entries by
    cosine similarity. Similarity is 1 - cosine_distance, so 1.0 is an
    exact match and 0.0 is orthogonal/unrelated.
    """
    query_embedding = await embed_query(query)

    distance = ReflectionEmbedding.embedding.cosine_distance(query_embedding)

    stmt = (
        select(ReflectionEntry, distance.label("distance"))
        .join(ReflectionEmbedding, ReflectionEmbedding.entry_id == ReflectionEntry.id)
        .order_by(distance)
        .limit(top_k)
    )

    result = await session.execute(stmt)

    candidates: list[RetrievalCandidate] = []
    for entry, dist in result.all():
        candidates.append(
            RetrievalCandidate(
                id=entry.id,
                title=entry.title,
                memo_interpretation=entry.memo_interpretation,
                conversation_guidance=entry.conversation_guidance,
                safety=entry.safety,
                emotions=entry.emotions,
                patterns=entry.patterns,
                contexts=entry.contexts,
                core_principles=entry.core_principles,
                point=entry.point,
                similarity=1 - dist,
            )
        )

    return candidates