from datetime import date

from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.database import supabase
from app.metrics import money, row_date

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(user_id: str = Depends(get_current_user)):
    """
    Returns aggregated dashboard data:
    total_sales, total_expenses, profit, inventory_count.
    """

    # Total sales
    sales_resp = (
        supabase.table("sales")
        .select("id, product_name, quantity, unit, amount, sale_date")
        .eq("user_id", user_id)
        .execute()
    )
    sales = sales_resp.data

    # Total expenses
    expenses_resp = (
        supabase.table("expenses")
        .select("id, expense_name, amount, expense_date")
        .eq("user_id", user_id)
        .execute()
    )
    expenses = expenses_resp.data

    # Inventory count
    inventory_resp = (
        supabase.table("inventory")
        .select("id, product_name, quantity, unit, price, created_at")
        .eq("user_id", user_id)
        .execute()
    )
    inventory = inventory_resp.data
    today = date.today()
    profile_resp = supabase.table("profiles").select("business_name").eq("id", user_id).single().execute()
    business_name = (profile_resp.data or {}).get("business_name", "your business")
    hour = __import__("datetime").datetime.now().hour
    greeting = "Good morning" if 5 <= hour < 12 else "Good afternoon" if 12 <= hour < 17 else "Good evening"
    today_sales = [row for row in sales if row_date(row, "sale_date") == today]
    today_expenses = [row for row in expenses if row_date(row, "expense_date") == today]
    total_sales = sum(float(row["amount"] or 0) for row in today_sales)
    total_expenses = sum(float(row["amount"] or 0) for row in today_expenses)

    profit = total_sales - total_expenses

    return {
        "today": today.isoformat(),
        "greeting": greeting,
        "business_name": business_name,
        "total_sales": money(total_sales),
        "total_expenses": money(total_expenses),
        "profit": money(profit),
        "inventory_count": len(inventory),
        "today_sales": sorted(today_sales, key=lambda row: row.get("sale_date") or "", reverse=True)[:5],
        "today_expenses": sorted(today_expenses, key=lambda row: row.get("expense_date") or "", reverse=True)[:5],
        "inventory": sorted(inventory, key=lambda row: float(row.get("quantity") or 0))[:6],
    }
