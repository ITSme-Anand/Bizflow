from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.dependencies import get_current_user
from app.database import supabase

router = APIRouter()


class SaleCreate(BaseModel):
    product_name: str
    quantity: float
    unit: str
    amount: float


@router.get("/sales")
async def get_sales(user_id: str = Depends(get_current_user)):
    """List all sales for the current user, newest first."""

    response = (
        supabase.table("sales")
        .select("*")
        .eq("user_id", user_id)
        .order("sale_date", desc=True)
        .execute()
    )

    return response.data


@router.post("/sales")
async def add_sale(sale: SaleCreate, user_id: str = Depends(get_current_user)):
    """
    Add a new sale and automatically reduce matching inventory.
    """

    # Insert the sale
    sale_data = {
        "user_id": user_id,
        "product_name": sale.product_name,
        "quantity": sale.quantity,
        "unit": sale.unit,
        "amount": sale.amount,
    }

    response = supabase.table("sales").insert(sale_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to add sale")

    # Auto-reduce inventory
    inv_resp = (
        supabase.table("inventory")
        .select("id, quantity")
        .eq("user_id", user_id)
        .eq("product_name", sale.product_name)
        .eq("unit", sale.unit)
        .execute()
    )

    if inv_resp.data:
        item = inv_resp.data[0]
        new_qty = max(float(item["quantity"]) - sale.quantity, 0)

        supabase.table("inventory").update(
            {"quantity": new_qty}
        ).eq("id", item["id"]).execute()

    return response.data[0]
