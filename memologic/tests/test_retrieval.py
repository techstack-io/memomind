# test_retrieval.py, run from memologic/
import asyncio
from app.models.base import AsyncSessionLocal
from app.services.retrieval_service import retrieve_candidates
from app.services.conversation_service import rank_reflection

async def main():
    async with AsyncSessionLocal() as session:
        candidates = await retrieve_candidates(session, "I keep blaming everyone else and feel stuck")
        for c in candidates:
            print(c.id, c.similarity)
        best = rank_reflection(candidates)
        print("Winner:", best.id if best else None)

asyncio.run(main())