from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.dependencies import get_current_user
from app.database import supabase

router = APIRouter()


class ExpenseCreate(BaseModel):
    expense_name: str
    amount: float


@router.get("/expenses")
async def get_expenses(user_id: str = Depends(get_current_user)):
    """List all expenses for the current user, newest first."""

    response = (
        supabase.table("expenses")
        .select("*")
        .eq("user_id", user_id)
        .order("expense_date", desc=True)
        .execute()
    )

    return response.data


@router.post("/expenses")
async def add_expense(
    expense: ExpenseCreate,
    user_id: str = Depends(get_current_user),
):
    """Add a new expense."""

    expense_data = {
        "user_id": user_id,
        "expense_name": expense.expense_name,
        "amount": expense.amount,
    }

    response = supabase.table("expenses").insert(expense_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to add expense")

    return response.data[0]
