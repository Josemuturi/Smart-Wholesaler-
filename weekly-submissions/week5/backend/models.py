"""
models.py — Smart Wholesaler ORM Models
-----------------------------------------
All SQLAlchemy table definitions. Tables are created automatically by
calling Base.metadata.create_all(engine) in main.py on startup.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """
    Represents a portal user.
    role = 'distributor' → admin / supplier view
    role = 'retailer'    → buyer / ordering view
    """
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String(100), nullable=False)
    email          = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role           = Column(String(20), nullable=False, default="retailer")  # distributor | retailer
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime, default=datetime.utcnow)

    # Relationships
    orders     = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")


class Product(Base):
    """
    Wholesale product listing.
    Managed by distributors; viewed and ordered by retailers.
    """
    __tablename__ = "products"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(200), nullable=False)
    sku           = Column(String(50), unique=True, index=True, nullable=False)
    category      = Column(String(100), nullable=False)
    unit          = Column(String(100), nullable=False)        # e.g. "50kg bag"
    unit_price    = Column(Float, nullable=False)              # in KSh
    min_order_qty = Column(Integer, nullable=False, default=1)
    stock_qty     = Column(Integer, nullable=False, default=0)
    description   = Column(Text, nullable=True)
    image_url     = Column(String(500), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)

    # Relationships
    order_items = relationship("OrderItem", back_populates="product")
    cart_items  = relationship("CartItem",  back_populates="product", cascade="all, delete-orphan")


class Order(Base):
    """
    A wholesale order placed by a retailer.
    status values: pending | processing | in-transit | delivered | cancelled
    """
    __tablename__ = "orders"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    status       = Column(String(30), nullable=False, default="pending")
    total_amount = Column(Float, nullable=False, default=0.0)
    created_at   = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user        = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """
    A single product line within an Order.
    unit_price is stored at order time (snapshot) to protect against future price changes.
    """
    __tablename__ = "order_items"

    id         = Column(Integer, primary_key=True, index=True)
    order_id   = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity   = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)   # price at time of order

    # Relationships
    order   = relationship("Order",   back_populates="order_items")
    product = relationship("Product", back_populates="order_items")


class CartItem(Base):
    """
    An item in a user's shopping cart (not yet an order).
    Each user can have at most one CartItem per product.
    """
    __tablename__ = "cart_items"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"),    nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity   = Column(Integer, nullable=False, default=1)
    added_at   = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user    = relationship("User",    back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")
