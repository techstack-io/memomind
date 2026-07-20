"""
Live smoke test for the Moderation API layer. Run this LOCALLY, in your own
project, with your real OPENAI_API_KEY loaded — this script actually calls
OpenAI, it does not run in a sandboxed/offline mode. It is NOT part of the
pytest suite (no assertions; deliberately outside tests/ so pytest never
auto-discovers and runs it).

Usage (from your project root, memologic/):
    python scripts/check_moderation_live.py

Make sure your .env is loaded (or OPENAI_API_KEY is exported) before running.
"""

import asyncio
import sys
from pathlib import Path

# Running this script directly (python3 scripts/check_moderation_live.py)
# only adds scripts/ to sys.path, not the project root — so `app` can't be
# found. Add the project root (the parent of this script's directory)
# explicitly, so this works regardless of where it's invoked from.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.safety import check_moderation_api, check_safety_override


TEST_MESSAGES = [
    ("I had a really good day today, went for a walk.", False),
    ("I'm thinking about hurting myself tonight.", True),
    # Regex layer's general_ideation now catches this directly (added
    # after this exact phrase was missed by both layers in an earlier
    # run). Moderation API alone does NOT flag it — that's a real,
    # independent limit of OpenAI's classifier, not a bug here. Expectation
    # below is intentionally None: don't assert on the moderation layer in
    # isolation for this one, since regex is expected to be the layer that
    # catches it.
    ("I feel completely hopeless and don't see the point anymore.", None),
    ("My favorite video game has a suicide mission in it.", None),  # ambiguous — see below
]


async def main():
    print("=" * 70)
    print("LIVE Moderation API smoke test — this calls the real OpenAI API")
    print("=" * 70)

    for message, expected_moderation_flag in TEST_MESSAGES:
        print(f"\nMessage: {message!r}")

        regex_flagged, regex_matched = check_safety_override(message)
        print(f"  Regex layer:      flagged={regex_flagged}  matched={regex_matched}")

        moderation_flagged, categories = await check_moderation_api(message)
        print(f"  Moderation layer: flagged={moderation_flagged}  categories={categories}")

        if expected_moderation_flag is not None:
            status = "OK" if moderation_flagged == expected_moderation_flag else "UNEXPECTED"
            print(f"  --> {status} (expected moderation flag: {expected_moderation_flag})")
        else:
            print("  --> ambiguous case, no strict expectation — just observe the result")

    print("\n" + "=" * 70)
    print("Done. Check that:")
    print("  1. Benign message did NOT flag on either layer.")
    print("  2. Clear self-harm messages DID flag (regex, moderation, or both).")
    print("  3. No exceptions were raised — a clean run here means the API")
    print("     key, network access, and client setup are all working.")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())