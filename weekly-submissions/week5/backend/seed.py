"""
seed.py — Smart Wholesaler Database Seeder
-------------------------------------------
Run this ONCE to populate the database with:
  - 2 demo user accounts (distributor + retailer)
  - 8 wholesale products

Usage:
    cd backend
    python seed.py

Safe to re-run — it skips records that already exist (checks by email / SKU).
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models import User, Product
from auth import hash_password

# Create all tables if they don't exist yet
Base.metadata.create_all(bind=engine)


# ─── Demo Users ───────────────────────────────────────────────────────────────
DEMO_USERS = [
    {
        "name":     "Alice Kamau",
        "email":    "admin@smartwholesaler.com",
        "password": "admin123",
        "role":     "distributor",
    },
    {
        "name":     "Brian Otieno",
        "email":    "retailer@smartwholesaler.com",
        "password": "retailer123",
        "role":     "retailer",
    },
]

# ─── Demo Products ────────────────────────────────────────────────────────────
DEMO_PRODUCTS = [
    {
        "name":          "Unga Pembe Wheat Flour",
        "sku":           "SKU-001",
        "category":      "Flour & Grains",
        "unit":          "50kg bag",
        "unit_price":    2400.0,
        "min_order_qty": 5,
        "stock_qty":     340,
        "description":   "High-quality wheat flour, ideal for baking and cooking. Consistent grind for professional kitchens.",
    },
    {
        "name":          "Kabras Sugar",
        "sku":           "SKU-002",
        "category":      "Sugar & Sweeteners",
        "unit":          "50kg bag",
        "unit_price":    2100.0,
        "min_order_qty": 10,
        "stock_qty":     220,
        "description":   "Premium refined white sugar from Kabras Sugar Factory. Perfect for bulk catering and retail.",
    },
    {
        "name":          "Bidco Cooking Oil",
        "sku":           "SKU-003",
        "category":      "Cooking Oils",
        "unit":          "20L jerry",
        "unit_price":    3800.0,
        "min_order_qty": 3,
        "stock_qty":     95,
        "description":   "Pure vegetable cooking oil. Long shelf life, heart-healthy, suitable for frying, baking, and salads.",
    },
    {
        "name":          "Maize Meal (Posho)",
        "sku":           "SKU-004",
        "category":      "Flour & Grains",
        "unit":          "25kg bag",
        "unit_price":    1350.0,
        "min_order_qty": 10,
        "stock_qty":     410,
        "description":   "Finely milled white maize meal. The East African staple grain for ugali, porridge, and more.",
    },
    {
        "name":          "Brookside Fresh Milk",
        "sku":           "SKU-005",
        "category":      "Dairy & Eggs",
        "unit":          "crate (12x1L)",
        "unit_price":    1440.0,
        "min_order_qty": 2,
        "stock_qty":     60,
        "description":   "Fresh pasteurised whole milk. Rich in protein and calcium. Requires refrigerated transport.",
    },
    {
        "name":          "Ketepa Tea Bags",
        "sku":           "SKU-006",
        "category":      "Beverages",
        "unit":          "carton (25 x 50)",
        "unit_price":    4500.0,
        "min_order_qty": 1,
        "stock_qty":     130,
        "description":   "Kenya's favourite premium tea. Each carton contains 25 boxes of 50 tea bags.",
    },
    {
        "name":          "Iodized Table Salt",
        "sku":           "SKU-007",
        "category":      "Sugar & Sweeteners",
        "unit":          "50kg bag",
        "unit_price":    1800.0,
        "min_order_qty": 5,
        "stock_qty":     0,
        "description":   "Refined iodized table salt. Essential mineral, fine granulation for easy dissolving.",
    },
    {
        "name":          "Sunflower Oil (Pwani)",
        "sku":           "SKU-008",
        "category":      "Cooking Oils",
        "unit":          "10L jerry",
        "unit_price":    2100.0,
        "min_order_qty": 5,
        "stock_qty":     180,
        "description":   "Light sunflower oil, rich in Vitamin E and perfect for stir-frying and salad dressings.",
    },
]


def seed():
    db = SessionLocal()
    created_users    = 0
    created_products = 0

    try:
        # ── Seed users ──
        for u in DEMO_USERS:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if existing:
                print(f"  [SKIP] User already exists: {u['email']}")
                continue
            user = User(
                name            = u["name"],
                email           = u["email"],
                hashed_password = hash_password(u["password"]),
                role            = u["role"],
                is_active       = True,
            )
            db.add(user)
            created_users += 1
            print(f"  [OK]   Created user: {u['email']}  (role: {u['role']})")

        db.commit()

        # ── Seed products ──
        for p in DEMO_PRODUCTS:
            existing = db.query(Product).filter(Product.sku == p["sku"]).first()
            if existing:
                print(f"  [SKIP] Product already exists: {p['sku']} — {p['name']}")
                continue
            product = Product(**p)
            db.add(product)
            created_products += 1
            print(f"  [OK]   Created product: {p['sku']} — {p['name']}")

        db.commit()

    finally:
        db.close()

    print()
    print("=" * 50)
    print(f"Seed complete: {created_users} users, {created_products} products created.")
    print()
    print("Demo credentials:")
    print("  Distributor: admin@smartwholesaler.com    / admin123")
    print("  Retailer:    retailer@smartwholesaler.com / retailer123")
    print("=" * 50)


if __name__ == "__main__":
    print("Seeding Smart Wholesaler database...")
    print()
    seed()
