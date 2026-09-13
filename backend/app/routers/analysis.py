from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.database import supabase

router = APIRouter()


@router.get("/analysis")
async def get_analysis(user_id: str = Depends(get_current_user)):
    """
    Returns business analysis data:
    total_sales, total_expenses, profit, inventory_count.
    """

    # Total sales
    sales_resp = (
        supabase.table("sales")
        .select("amount")
        .eq("user_id", user_id)
        .execute()
    )
    total_sales = sum(float(row["amount"]) for row in sales_resp.data)

    # Total expenses
    expenses_resp = (
        supabase.table("expenses")
        .select("amount")
        .eq("user_id", user_id)
        .execute()
    )
    total_expenses = sum(float(row["amount"]) for row in expenses_resp.data)

    # Inventory count
    inventory_resp = (
        supabase.table("inventory")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )
    inventory_count = inventory_resp.count or 0

    profit = total_sales - total_expenses

    return {
        "total_sales": round(total_sales, 2),
        "total_expenses": round(total_expenses, 2),
        "profit": round(profit, 2),
        "inventory_count": inventory_count,
    }
