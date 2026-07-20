"""
Tests for app.services.safety.

Run with: pytest tests/ -v

- Regex layer tests (`check_safety_override`) run fully offline, no
  network, no API key needed.
- Moderation layer tests use fixtures from conftest.py to mock the OpenAI
  client — they verify fail-open behavior and combined-check logic
  WITHOUT calling the real API. A real live-API smoke test is a separate,
  manually-run script: scripts/check_moderation_live.py.
"""

import pytest

from app.services.safety import (
    SAFETY_RESPONSE,
    check_safety,
    check_safety_override,
    check_moderation_api,
)


# --- Regex layer: should flag ------------------------------------------------

SHOULD_FLAG = [
    "I feel suicidal",
    "I'm suicidal",
    "I want to die",
    "I really just want to kill myself",
    "no reason to live",
    "I can't go on",
    "I don't want to be here anymore",
    "I have a plan to kill myself",
    "I just tried to kill myself",
    "I already took the pills",
    "I want to kill myself",
    "I plan to end my life",
    "i dont think i can keep myself safe",
    "I overdosed",
    "I'm going to hurt myself",
    "SUICIDAL",  # case insensitivity
    "  I want to die   ",  # whitespace normalization
    # Added after a live Moderation API smoke test confirmed both layers
    # missed this exact phrasing — see safety.py general_ideation comment.
    "I feel completely hopeless and don't see the point anymore.",
    "I feel hopeless",
    "I don't see the point anymore",
    "I don't see the point in living",
    "what's the point anymore",
    "nothing matters anymore",
]


@pytest.mark.parametrize("message", SHOULD_FLAG)
def test_flags_high_risk_messages(message):
    flagged, matched = check_safety_override(message)
    assert flagged is True, f"Expected flag for: {message!r}"
    assert matched is not None


# --- Regex layer: should NOT flag -------------------------------------------

SHOULD_NOT_FLAG = [
    "I want to eat pizza tonight",
    "This meeting is killing me but it's fine",
    "I want to learn to kill it at my job interview",
    "Just a normal message about my day",
    "",
    "   ",
    "I had a great day today",
    "How do I stop feeling anxious before presentations?",
    # Benign lookalikes for the hopelessness/no-point patterns added above —
    # these must stay clear so the expanded pattern doesn't overcorrect
    # into flagging mundane complaints.
    "I don't see the point of this meeting",
    "this printer is hopeless",
    "what's the point of this class if we never use it",
    "I'm hopeless at cooking",
    "nothing matters more to me than my family",
    "I don't see the point in arguing about this",
]


@pytest.mark.parametrize("message", SHOULD_NOT_FLAG)
def test_does_not_flag_benign_messages(message):
    flagged, matched = check_safety_override(message)
    assert flagged is False, f"Unexpected flag for: {message!r}"
    assert matched is None


@pytest.mark.xfail(
    reason=(
        "KNOWN TRADEOFF, not yet resolved: general_ideation's bare "
        "'suicid\\w*' pattern matches ANY mention of the word, including "
        "third-person/topical ones with no first-person crisis content. "
        "This is the direct cost of the broad recall-focused catch-all — "
        "worth a product decision on whether to accept this false-positive "
        "rate or add a first-person-context requirement to this pattern."
    ),
    strict=True,
)
def test_topical_suicide_mention_is_a_known_false_positive():
    flagged, _ = check_safety_override(
        "My favorite video game has a suicide mission in it"
    )
    assert flagged is False


def test_raises_on_non_string_input():
    with pytest.raises(TypeError):
        check_safety_override(12345)  # type: ignore[arg-type]


# --- Moderation layer: fail-open behavior (mocked via conftest fixtures) ---

@pytest.mark.asyncio
async def test_moderation_fails_open_on_api_error(mock_moderation_failure):
    """If the Moderation API call raises, we must NOT flag and must NOT
    propagate the exception — the regex layer is the guaranteed backstop,
    a moderation outage should never block or crash the app."""
    with mock_moderation_failure(ConnectionError("simulated network failure")):
        flagged, categories = await check_moderation_api("anything")
        assert flagged is False
        assert categories == []


@pytest.mark.asyncio
async def test_moderation_flags_on_self_harm_category(mock_moderation_response):
    with mock_moderation_response({"self-harm": True, "violence": False}):
        flagged, categories = await check_moderation_api("some message")
        assert flagged is True
        assert categories == ["self-harm"]


@pytest.mark.asyncio
async def test_moderation_ignores_non_self_harm_categories(mock_moderation_response):
    """Violence/hate/sexual flags should NOT trigger this hard override —
    only the three self-harm-relevant categories should."""
    with mock_moderation_response({"violence": True, "hate": True}):
        flagged, categories = await check_moderation_api("some message")
        assert flagged is False
        assert categories == []


# --- Combined check_safety(): short-circuit behavior ------------------------

@pytest.mark.asyncio
async def test_check_safety_short_circuits_on_regex_match(mock_check_moderation_api):
    """If regex already flags it, the Moderation API must NOT be called at
    all — this is a cost/latency guarantee, not just a correctness one."""
    with mock_check_moderation_api() as mocked_moderation:
        flagged, matched = await check_safety("I want to kill myself")
        assert flagged is True
        assert matched == "direct_suicide_intent"
        mocked_moderation.assert_not_called()


@pytest.mark.asyncio
async def test_check_safety_falls_through_to_moderation_when_regex_clear(
    mock_moderation_response,
):
    with mock_moderation_response({"self-harm/intent": True}):
        # A message the regex layer won't catch, but moderation (mocked) will.
        flagged, matched = await check_safety("something indirectly concerning")
        assert flagged is True
        assert matched == "moderation:self-harm/intent"


@pytest.mark.asyncio
async def test_check_safety_clear_when_both_layers_clear(mock_check_moderation_api):
    with mock_check_moderation_api(return_value=(False, [])):
        flagged, matched = await check_safety("I had a lovely walk today")
        assert flagged is False
        assert matched is None


def test_safety_response_is_nonempty_and_mentions_crisis_help():
    # Sanity check that the fixed response wasn't accidentally emptied by
    # an edit, and still points toward getting help.
    assert SAFETY_RESPONSE.strip() != ""
    assert "crisis" in SAFETY_RESPONSE.lower() or "emergency" in SAFETY_RESPONSE.lower()