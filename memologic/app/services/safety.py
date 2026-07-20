"""Deterministic safety override for high-risk user messages.

This module provides a fast, model-free check that runs before any LLM,
retrieval, memory, or contemplative reasoning step.

Coverage is split into two tiers, deliberately:
  - Specific intent/plan/attempt patterns (named, for telemetry) — these
    tell you *what kind* of risk was matched.
  - A broad "general_ideation" catch-all — bare mentions of suicide, wanting
    to die, or similar, without requiring a specific intent-verb structure.

The catch-all exists because requiring a rigid "I want to / I plan to +
harm phrase" structure misses extremely common real phrasings — plain "I
feel suicidal," "I want to die," "no reason to live," or filler words
sitting between an intent verb and the harm phrase ("I just want to kill
myself"). For a hard safety gate, a false positive (flagging a message that
wasn't actually a crisis) is far cheaper than a false negative. When in
doubt, this module is written to over-trigger, not under-trigger.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Final

from openai import AsyncOpenAI, OpenAIError

from app.settings import get_settings

logger = logging.getLogger(__name__)


SAFETY_RESPONSE: Final[str] = (
    "I'm really sorry you're carrying this right now. "
    "I'm not able to provide the kind of immediate help this situation may need. "
    "Please contact local emergency services or a crisis hotline now, or reach out "
    "to someone you trust who can stay with you. If you may act on these thoughts, "
    "move away from anything you could use to hurt yourself and go somewhere other "
    "people are present."
)


@dataclass(frozen=True)
class SafetyPattern:
    """A named regular-expression rule used by the hard safety override."""

    name: str
    expression: re.Pattern[str]


def _compile(pattern: str) -> re.Pattern[str]:
    return re.compile(pattern, flags=re.IGNORECASE)


# Allows 0-3 filler words (e.g. "really", "just", "honestly") between an
# intent verb and the harm phrase, so "I just want to kill myself" still
# matches the same as "I want to kill myself".
_GAP = r"(?:\s+\w+){0,3}?"

_INTENT_VERBS = (
    r"(?:i\s*(?:am|'m)\s+going\s+to|i\s+will|i\s+want\s+to|"
    r"i\s+plan\s+to|i\s+intend\s+to)"
)

# These rules target direct, first-person statements indicating possible
# imminent self-harm or suicide risk, with tolerance for filler words. They
# are not intended to replace a broader contextual safety classifier.
SAFETY_PATTERNS: Final[tuple[SafetyPattern, ...]] = (
    SafetyPattern(
        name="direct_suicide_intent",
        expression=_compile(
            rf"\b{_INTENT_VERBS}{_GAP}\s*"
            r"(?:kill\s+myself|end\s+my\s+life|die\s+by\s+suicide)\b"
        ),
    ),
    SafetyPattern(
        name="immediate_self_harm_intent",
        expression=_compile(
            rf"\b{_INTENT_VERBS}{_GAP}\s*"
            r"(?:hurt\s+myself|harm\s+myself|cut\s+myself)\b"
        ),
    ),
    SafetyPattern(
        name="cannot_stay_safe",
        expression=_compile(
            r"\b(?:i\s+cannot|i\s+can't|i\s+dont\s+think\s+i\s+can|"
            r"i\s+don't\s+think\s+i\s+can)\s+"
            r"(?:keep\s+myself\s+safe|stay\s+safe|stop\s+myself)\b"
        ),
    ),
    SafetyPattern(
        name="active_attempt",
        expression=_compile(
            r"\b(?:i\s+just\s+tried\s+to\s+kill\s+myself|"
            r"i\s+have\s+already\s+hurt\s+myself|"
            r"i\s+already\s+took\s+(?:the\s+)?pills|"
            r"i\s+overdosed)\b"
        ),
    ),
    SafetyPattern(
        name="suicide_method_or_plan",
        expression=_compile(
            r"\b(?:i\s+have\s+a\s+plan\s+to\s+(?:kill\s+myself|"
            r"end\s+my\s+life)|i\s+know\s+how\s+i(?:'m|\s+am)\s+"
            r"going\s+to\s+(?:kill\s+myself|end\s+my\s+life))\b"
        ),
    ),
    # Broad, low-precision catch-all. Deliberately does NOT require an
    # intent-verb structure — bare mentions are enough. This is where
    # "I'm suicidal," "I want to die," "no reason to live," etc. are caught.
    SafetyPattern(
        name="general_ideation",
        expression=_compile(
            r"\b(?:suicid\w*|want(?:s|ed)?\s+to\s+die|wish(?:ed)?\s+i\s+"
            r"(?:was|were)\s+dead|no\s+reason\s+to\s+live|"
            r"(?:can'?t|cannot)\s+go\s+on|don'?t\s+want\s+to\s+be\s+"
            r"(?:here|alive)\s+anymore|better\s+off\s+dead|"
            r"end(?:ing)?\s+it\s+all|kill\s+myself|hurt\s+myself|"
            r"harm\s+myself|"
            # Hopelessness / "no point" phrasing — added after a live
            # Moderation API test confirmed both layers missed "I feel
            # completely hopeless and don't see the point anymore."
            # Anchored to "anymore" / "in life" / "of it all" etc. rather
            # than matching bare "point" or "hopeless" alone, to avoid
            # false-positiving on mundane complaints like "I don't see the
            # point of this meeting" or "this printer is hopeless."
            r"feel(?:ing)?\s+(?:completely\s+)?hopeless|"
            r"don'?t\s+see\s+(?:the\s+)?point\s+(?:anymore|in\s+(?:anything|life|living)|of\s+(?:anything|it\s+all))|"
            r"what'?s\s+the\s+point\s+(?:anymore|of\s+(?:anything|living))|"
            r"nothing\s+matters\s+anymore)\b"
        ),
    ),
)


def _normalize_message(message: str) -> str:
    """Normalize whitespace without changing the meaning of the message."""

    return " ".join(message.strip().split())


def check_safety_override(message: str) -> tuple[bool, str | None]:
    """Return whether the hard safety override should be activated.

    Args:
        message: The raw user message.

    Returns:
        A tuple containing:
        - True and the matched rule name when a safety rule is triggered.
        - False and None when no rule is triggered.
    """

    if not isinstance(message, str):
        raise TypeError("message must be a string")

    normalized_message = _normalize_message(message)

    if not normalized_message:
        return False, None

    for safety_pattern in SAFETY_PATTERNS:
        if safety_pattern.expression.search(normalized_message):
            return True, safety_pattern.name

    return False, None


# --- Layer 2: OpenAI Moderation API -----------------------------------------
#
# The regex layer above is the always-on, zero-dependency, zero-latency
# floor — it never goes down and never costs anything. This second layer
# is a genuine model-based classifier, run alongside it, that catches what
# regex structurally can't: indirect language, non-English phrasing, and
# novel phrasings no one thought to write a pattern for.
#
# This is additive, not a replacement. If this call fails or times out
# (network issue, rate limit, provider outage), it fails OPEN — meaning it
# does not block the user, and does not raise. The regex layer still runs
# regardless and remains the guaranteed backstop. A moderation-API outage
# should degrade the safety system, not take the whole app down with it.
#
# NOTE: moderation is general-purpose — it also flags violence, hate, and
# sexual content, which are out of scope for this hard override. Only the
# self-harm-relevant categories below are treated as a safety override;
# other flagged categories are ignored here (they may still be worth
# logging separately, just not as a hard block on this path).

_SELF_HARM_CATEGORIES: Final[tuple[str, ...]] = (
    "self-harm",
    "self-harm/intent",
    "self-harm/instructions",
)

_moderation_client = AsyncOpenAI(api_key=get_settings().openai_api_key)


async def check_moderation_api(message: str) -> tuple[bool, list[str]]:
    """Check a message against OpenAI's Moderation API.

    Returns:
        A tuple containing:
        - True and the list of matched self-harm-relevant category names
          when flagged.
        - False and an empty list when clear, OR when the API call itself
          failed (fail-open — see module note above).

    NOTE: verify "omni-moderation-latest" is still the current recommended
    moderation model against OpenAI's docs before shipping — model names
    on this endpoint have changed before (e.g. from text-moderation-latest).
    """

    if not message.strip():
        return False, []

    try:
        response = await _moderation_client.moderations.create(
            model="omni-moderation-latest",
            input=message,
        )
    except OpenAIError:
        logger.exception("Moderation API call failed; failing open for this turn.")
        return False, []
    except Exception:
        logger.exception("Unexpected error calling Moderation API; failing open.")
        return False, []

    result = response.results[0]
    categories = result.categories.model_dump()

    matched = [name for name in _SELF_HARM_CATEGORIES if categories.get(name)]
    return bool(matched), matched


async def check_safety(message: str) -> tuple[bool, str | None]:
    """Run both safety layers and return a single combined verdict.

    This is the function callers (e.g. conversation_service.py) should use
    — it runs the free, instant regex check first, and only calls out to
    the Moderation API if the regex layer didn't already flag the message.
    """

    flagged, matched_name = check_safety_override(message)
    if flagged:
        return True, matched_name

    moderation_flagged, moderation_categories = await check_moderation_api(message)
    if moderation_flagged:
        return True, f"moderation:{','.join(moderation_categories)}"

    return False, None