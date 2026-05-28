"""
routers/cart.py — Smart Wholesaler Cart Endpoints
---------------------------------------------------
GET  /cart        → Get current user's cart items
POST /cart/items  → Add (or update) an item in the cart
DELETE /cart/items/{product_id} → Remove an item from the cart
DELETE /cart      → Clear the entire cart
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=List[schemas.CartItemOut])
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return all cart items for the currently logged-in user."""
    return (
        db.query(models.CartItem)
        .filter(models.CartItem.user_id == current_user.id)
        .all()
    )


@router.post("/items", response_model=schemas.CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Add a product to the cart.
    If the product is already in the cart, increase the quantity instead of inserting a duplicate.
    """
    # Validate product exists and has stock
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    if product.stock_qty == 0:
        raise HTTPException(status_code=400, detail="This product is out of stock.")
    if item.quantity < product.min_order_qty:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order quantity for this product is {product.min_order_qty}.",
        )

    # Upsert: update quantity if already in cart
    existing = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.user_id    == current_user.id,
            models.CartItem.product_id == item.product_id,
        )
        .first()
    )

    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = models.CartItem(
        user_id    = current_user.id,
        product_id = item.product_id,
        quantity   = item.quantity,
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.delete("/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Remove a specific product from the cart."""
    item = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.user_id    == current_user.id,
            models.CartItem.product_id == product_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item not in cart.")
    db.delete(item)
    db.commit()


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Remove all items from the current user's cart."""
    db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
    db.commit()
