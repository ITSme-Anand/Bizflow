from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.dependencies import get_current_user
from app.database import supabase

router = APIRouter()


class InventoryCreate(BaseModel):
    product_name: str
    quantity: float
    unit: str
    price: float


@router.get("/inventory")
async def get_inventory(user_id: str = Depends(get_current_user)):
    """List all inventory items for the current user."""

    response = (
        supabase.table("inventory")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


@router.post("/inventory")
async def add_inventory(
    item: InventoryCreate,
    user_id: str = Depends(get_current_user),
):
    """Add a new inventory product."""

    item_data = {
        "user_id": user_id,
        "product_name": item.product_name,
        "quantity": item.quantity,
        "unit": item.unit,
        "price": item.price,
    }

    response = supabase.table("inventory").insert(item_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to add item")

    return response.data[0]


@router.patch("/inventory/{item_id}/increase")
async def increase_inventory(
    item_id: int,
    user_id: str = Depends(get_current_user),
):
    """Increment inventory item quantity by 1."""

    # Fetch current quantity
    resp = (
        supabase.table("inventory")
        .select("id, quantity")
        .eq("id", item_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not resp.data:
        raise HTTPException(status_code=404, detail="Item not found")

    new_qty = float(resp.data[0]["quantity"]) + 1

    update_resp = (
        supabase.table("inventory")
        .update({"quantity": new_qty})
        .eq("id", item_id)
        .eq("user_id", user_id)
        .execute()
    )

    return update_resp.data[0]


@router.patch("/inventory/{item_id}/decrease")
async def decrease_inventory(
    item_id: int,
    user_id: str = Depends(get_current_user),
):
    """Decrement inventory item quantity by 1 (minimum 0)."""

    resp = (
        supabase.table("inventory")
        .select("id, quantity")
        .eq("id", item_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not resp.data:
        raise HTTPException(status_code=404, detail="Item not found")

    new_qty = max(float(resp.data[0]["quantity"]) - 1, 0)

    update_resp = (
        supabase.table("inventory")
        .update({"quantity": new_qty})
        .eq("id", item_id)
        .eq("user_id", user_id)
        .execute()
    )

    return update_resp.data[0]
