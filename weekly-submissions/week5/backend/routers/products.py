"""
routers/products.py — Smart Wholesaler Product Endpoints
----------------------------------------------------------
GET  /products             → List all products (optionally filtered)
GET  /categories           → List all unique categories
POST /products             → Create a new product (distributor only)
PATCH /products/{id}/stock → Update stock quantity (distributor only)
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user, require_distributor

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[schemas.ProductOut])
def list_products(
    category: Optional[str] = Query(None, description="Filter by category name"),
    search:   Optional[str] = Query(None, description="Search by name or SKU"),
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),   # must be logged in
):
    """
    Return a list of products. Supports optional ?category= and ?search= filters.
    Accessible to any authenticated user (distributor or retailer).
    """
    query = db.query(models.Product)

    if category and category.lower() != "all":
        query = query.filter(models.Product.category == category)

    if search:
        like = f"%{search}%"
        query = query.filter(
            models.Product.name.ilike(like) | models.Product.sku.ilike(like)
        )

    return query.order_by(models.Product.name).all()


@router.get("/categories", response_model=List[str], tags=["Products"])
def list_categories(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    """Return a deduplicated list of all product categories (for the filter chips)."""
    rows = db.query(models.Product.category).distinct().order_by(models.Product.category).all()
    return [row[0] for row in rows]


@router.post("", response_model=schemas.ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_distributor),  # distributor only
):
    """Create a new product listing. Restricted to distributor accounts."""
    # Check SKU uniqueness
    if db.query(models.Product).filter(models.Product.sku == product.sku).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A product with SKU '{product.sku}' already exists.",
        )

    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.patch("/{product_id}/stock", response_model=schemas.ProductOut)
def update_stock(
    product_id: int,
    stock_qty: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_distributor),
):
    """Update the stock quantity of a product. Distributor only."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.stock_qty = stock_qty
    db.commit()
    db.refresh(product)
    return product
