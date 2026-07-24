"""Authentication dependency for verifying Hexclave-issued access tokens.

The frontend (memoapp) authenticates users via Hexclave and attaches the
user's access token to backend requests via the `x-stack-access-token`
header. This module verifies that token locally against Hexclave's JWKS
endpoint (no network round-trip to Hexclave per request) and extracts the
authenticated user's ID for use by request handlers.

Requires the `HEXCLAVE_PROJECT_ID` environment variable and the
`PyJWT[crypto]` dependency.
"""

from __future__ import annotations

from functools import lru_cache

import jwt
from fastapi import Header, HTTPException
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError

from app.settings import get_settings


@lru_cache
def _get_jwks_client() -> PyJWKClient:
    settings = get_settings()
    return PyJWKClient(
        f"https://api.hexclave.com/api/v1/projects/"
        f"{settings.hexclave_project_id}/.well-known/jwks.json"
    )


async def get_current_user_id(
    x_stack_access_token: str | None = Header(default=None),
) -> str:
    """FastAPI dependency that resolves the authenticated user's ID.

    Raises HTTPException(401) if the token is missing or invalid.
    """

    if not x_stack_access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    settings = get_settings()

    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(x_stack_access_token)
        payload = jwt.decode(
            x_stack_access_token,
            signing_key.key,
            algorithms=["ES256"],
            audience=settings.hexclave_project_id,
        )
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload["sub"]