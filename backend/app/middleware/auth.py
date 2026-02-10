from __future__ import annotations

from fastapi import Depends, HTTPException, Header

from app.config import settings
from app.services.supabase_client import get_supabase


async def get_current_user_id(
    authorization: str = Header(..., description="Bearer <supabase-access-token>"),
) -> str:
    """Extract and verify the Supabase JWT, returning the user's UUID string.

    The frontend must send:
        Authorization: Bearer <access_token>
    """
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = parts[1]
    sb = get_supabase()

    try:
        resp = sb.auth.get_user(token)
        if resp is None or resp.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return str(resp.user.id)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")


async def optional_user_id(
    authorization: str | None = Header(default=None),
) -> str | None:
    """Same as get_current_user_id but returns None when no token is present.

    Useful for endpoints that work for both anonymous and authenticated users.
    """
    if authorization is None:
        return None
    try:
        return await get_current_user_id(authorization)
    except HTTPException:
        return None
