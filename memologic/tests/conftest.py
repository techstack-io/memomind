"""
Shared fixtures for the test suite.

Fixtures here are meant to be reused across test files as the suite grows
(test_safety.py today; test_conversation_service.py, etc. later) — anything
that mocks the same external dependency (the OpenAI moderation client)
should live here once, rather than being redefined per test file.
"""

from unittest.mock import AsyncMock, patch

import pytest


class _FakeCategories:
    """Stand-in for the `categories` object OpenAI's moderation response
    returns. Real usage in safety.py calls `.model_dump()` on it."""

    def __init__(self, flagged_categories: dict[str, bool] | None = None):
        self._flagged = flagged_categories or {}

    def model_dump(self) -> dict[str, bool]:
        return dict(self._flagged)


class _FakeModerationResult:
    def __init__(self, flagged_categories: dict[str, bool] | None = None):
        self.categories = _FakeCategories(flagged_categories)


class _FakeModerationResponse:
    def __init__(self, flagged_categories: dict[str, bool] | None = None):
        self.results = [_FakeModerationResult(flagged_categories)]


@pytest.fixture
def mock_moderation_response():
    """Returns a factory for building a fake Moderation API response.

    Usage:
        def test_something(mock_moderation_response):
            with mock_moderation_response({"self-harm": True}):
                flagged, categories = await check_moderation_api("...")
    """

    def _make(flagged_categories: dict[str, bool] | None = None):
        fake_response = _FakeModerationResponse(flagged_categories)
        return patch(
            "app.services.safety._moderation_client.moderations.create",
            new=AsyncMock(return_value=fake_response),
        )

    return _make


@pytest.fixture
def mock_moderation_failure():
    """Patches the moderation client to raise, for testing fail-open
    behavior.

    Usage:
        def test_something(mock_moderation_failure):
            with mock_moderation_failure(ConnectionError("boom")):
                flagged, categories = await check_moderation_api("...")
    """

    def _make(exception: Exception):
        return patch(
            "app.services.safety._moderation_client.moderations.create",
            new=AsyncMock(side_effect=exception),
        )

    return _make


@pytest.fixture
def mock_check_moderation_api():
    """Patches check_moderation_api itself (not the underlying client) —
    useful when testing check_safety()'s short-circuit / fall-through
    logic, where you don't care how the moderation layer arrives at its
    answer, only what it returns.

    Usage:
        def test_something(mock_check_moderation_api):
            with mock_check_moderation_api(return_value=(False, [])) as m:
                ...
                m.assert_not_called()  # or .assert_called_once()
    """

    def _make(return_value=None, side_effect=None):
        return patch(
            "app.services.safety.check_moderation_api",
            new=AsyncMock(return_value=return_value, side_effect=side_effect),
        )

    return _make