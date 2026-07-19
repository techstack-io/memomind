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

import re
from dataclasses import dataclass
from typing import Final


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
            r"harm\s+myself)\b"
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