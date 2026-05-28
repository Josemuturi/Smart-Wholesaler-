"""
schemas.py — Smart Wholesaler Pydantic Schemas
------------------------------------------------
Request bodies and response shapes for all API endpoints.
FastAPI uses these for automatic validation and OpenAPI docs generation.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ─── User Schemas ─────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "retailer"  # distributor | retailer


class UserCreate(UserBase):
    """Used when registering a new user — includes raw password."""
    password: str


class UserOut(UserBase):
    """Returned by the API — never exposes hashed_password."""
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    """POST /auth/login request body."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """POST /auth/login response — matches the shape the React frontend expects."""
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Product Schemas ──────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    sku: str
    category: str
    unit: str
    unit_price: float
    min_order_qty: int = 1
    stock_qty: int = 0
    description: Optional[str] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    """POST /products request body (distributor only)."""
    pass


class ProductOut(ProductBase):
    """Returned by GET /products."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Cart Schemas ─────────────────────────────────────────────────────────────

class CartItemCreate(BaseModel):
    """POST /cart/items request body."""
    product_id: int
    quantity: int


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductOut
    added_at: datetime

    class Config:
        from_attributes = True


# ─── Order Schemas ────────────────────────────────────────────────────────────

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: ProductOut

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    created_at: datetime
    order_items: List[OrderItemOut] = []

    class Config:
        from_attributes = True
