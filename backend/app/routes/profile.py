from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.supabase_client import get_supabase
from app.middleware.auth import get_current_user_id

router = APIRouter(prefix="/api/profile", tags=["profile"])


class ProfileResponse(BaseModel):
    id: str
    display_name: str
    avatar_url: Optional[str] = None
    plan: str
    credits: int
    language: str
    created_at: str
    updated_at: str


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    language: Optional[str] = None


@router.get("", response_model=ProfileResponse)
async def get_profile(user_id: str = Depends(get_current_user_id)):
    sb = get_supabase()
    resp = sb.table("profiles").select("*").eq("id", user_id).single().execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return resp.data


@router.patch("", response_model=ProfileResponse)
async def update_profile(
    body: ProfileUpdate,
    user_id: str = Depends(get_current_user_id),
):
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    sb = get_supabase()
    resp = sb.table("profiles").update(updates).eq("id", user_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return resp.data[0]


class CreditTransaction(BaseModel):
    id: int
    user_id: str
    amount: int
    reason: str
    job_id: Optional[str] = None
    created_at: str


@router.get("/credits", response_model=list[CreditTransaction])
async def get_credit_history(user_id: str = Depends(get_current_user_id)):
    sb = get_supabase()
    resp = (
        sb.table("credit_transactions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return resp.data
