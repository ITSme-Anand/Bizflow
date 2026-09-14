from datetime import date

from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.database import supabase
from app.metrics import money, monthly_reports, period_total, shift_month, month_start

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
        .select("amount, sale_date")
        .eq("user_id", user_id)
        .execute()
    )
    sales = sales_resp.data

    # Total expenses
    expenses_resp = (
        supabase.table("expenses")
        .select("amount, expense_date")
        .eq("user_id", user_id)
        .execute()
    )
    expenses = expenses_resp.data

    # Inventory count
    inventory_resp = (
        supabase.table("inventory")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )
    inventory_count = len(inventory_resp.data)
    today = date.today()
    current_start = month_start(today)
    previous_start = shift_month(current_start, -1)
    current_sales = period_total(sales, "sale_date", current_start, shift_month(current_start, 1))
    current_expenses = period_total(expenses, "expense_date", current_start, shift_month(current_start, 1))
    previous_sales = period_total(sales, "sale_date", previous_start, current_start)
    previous_expenses = period_total(expenses, "expense_date", previous_start, current_start)
    current_profit = money(current_sales - current_expenses)
    previous_profit = money(previous_sales - previous_expenses)
    profit_margin = money((current_profit / current_sales) * 100) if current_sales else 0
    if current_sales <= 0:
        pulse = {"tone": "neutral", "status": "Getting started", "title": "Start recording your business activity.", "message": "Once you record sales and expenses, Bizflow will turn them into useful performance insights."}
    elif current_profit > 0:
        pulse = {"tone": "positive", "status": "Positive", "title": "Your business is currently profitable.", "message": "Sales are ahead of expenses this month. Keep protecting your margin while you grow revenue."}
    elif current_profit < 0:
        pulse = {"tone": "warning", "status": "Attention", "title": "Expenses are higher than sales.", "message": "Review this month's spending and identify one cost you can control before adding new commitments."}
    else:
        pulse = {"tone": "neutral", "status": "Balanced", "title": "Sales and expenses are balanced.", "message": "Your records are at break-even. A small lift in sales or a small reduction in costs will improve your margin."}

    return {
        "total_sales": money(sum(float(row["amount"] or 0) for row in sales)),
        "total_expenses": money(sum(float(row["amount"] or 0) for row in expenses)),
        "profit": money(current_profit),
        "inventory_count": inventory_count,
        "current_period": {"sales": current_sales, "expenses": current_expenses, "profit": current_profit},
        "previous_period": {"sales": previous_sales, "expenses": previous_expenses, "profit": previous_profit},
        "profit_margin": profit_margin,
        "monthly_reports": monthly_reports(sales, expenses, today),
        "pulse": pulse,
    }
