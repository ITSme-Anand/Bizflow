from fastapi import APIRouter, Depends, HTTPException

from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    response = supabase.table("profiles").select("id, business_name, email, created_at").eq("id", user_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return response.data