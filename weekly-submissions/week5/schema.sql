-- ═══════════════════════════════════════════════════════════════════════════
-- schema.sql — Smart Wholesaler (Secure-Duka) PostgreSQL Database Schema
-- BIT3208 — Internet Programming | Week 5
-- ═══════════════════════════════════════════════════════════════════════════
--
-- This file creates all tables, indexes, and seeds demo data.
-- Introduced in Week 5 when the FastAPI backend is set up.
--
-- To run against PostgreSQL:
--   psql -U postgres -d smart_wholesaler -f schema.sql
--
-- To create the database first:
--   createdb smart_wholesaler
--   psql -U postgres -d smart_wholesaler -f schema.sql
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── Drop tables (safe re-run) ───────────────────────────────────────────────
DROP TABLE IF EXISTS cart_items  CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders      CASCADE;
DROP TABLE IF EXISTS products    CASCADE;
DROP TABLE IF EXISTS users       CASCADE;


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 1: users
-- Stores both distributor (admin/supplier) and retailer (buyer) accounts.
-- Passwords are stored as bcrypt hashes — NEVER plain text.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE users (
    id               SERIAL       PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    role             VARCHAR(20)  NOT NULL DEFAULT 'retailer'
                     CHECK (role IN ('distributor', 'retailer')),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  users                IS 'Portal users — distributors (admin) and retailers (buyers)';
COMMENT ON COLUMN users.role           IS 'distributor = supplier/admin, retailer = buyer';
COMMENT ON COLUMN users.hashed_password IS 'bcrypt hash — never store plain text passwords';


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 2: products
-- Wholesale product catalogue managed by distributors.
-- Retailers browse and order from this catalogue.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE products (
    id             SERIAL        PRIMARY KEY,
    name           VARCHAR(200)  NOT NULL,
    sku            VARCHAR(50)   NOT NULL UNIQUE,
    category       VARCHAR(100)  NOT NULL,
    unit           VARCHAR(100)  NOT NULL,       -- e.g. '50kg bag', '20L jerry can'
    unit_price     NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    min_order_qty  INTEGER       NOT NULL DEFAULT 1 CHECK (min_order_qty >= 1),
    stock_qty      INTEGER       NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    description    TEXT,
    image_url      VARCHAR(500),
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  products           IS 'Wholesale product catalogue';
COMMENT ON COLUMN products.unit      IS 'Packaging unit, e.g. 50kg bag, 20L jerry, carton of 24';
COMMENT ON COLUMN products.unit_price IS 'Price in Kenyan Shillings (KSh)';
COMMENT ON COLUMN products.min_order_qty IS 'Minimum wholesale order quantity';


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 3: orders
-- A wholesale order placed by a retailer.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE orders (
    id            SERIAL        PRIMARY KEY,
    user_id       INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        VARCHAR(30)   NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','processing','in-transit','delivered','cancelled')),
    total_amount  NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  orders        IS 'Wholesale orders placed by retailers';
COMMENT ON COLUMN orders.status IS 'pending | processing | in-transit | delivered | cancelled';


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 4: order_items
-- Individual product lines within an order.
-- unit_price is snapshotted at order time to preserve historical accuracy
-- even if the product price changes later.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE order_items (
    id         SERIAL        PRIMARY KEY,
    order_id   INTEGER       NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
    product_id INTEGER       NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity   INTEGER       NOT NULL CHECK (quantity >= 1),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0)
    -- unit_price is the price AT TIME OF ORDER — not the current product price
);

COMMENT ON TABLE  order_items            IS 'Line items within each order';
COMMENT ON COLUMN order_items.unit_price IS 'Price per unit AT TIME OF ORDER (historical snapshot)';


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 5: cart_items
-- Temporary cart — items added but not yet ordered.
-- One record per user per product (enforced by UNIQUE constraint).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE cart_items (
    id         SERIAL      PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    product_id INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate cart entries for the same product
    UNIQUE (user_id, product_id)
);

COMMENT ON TABLE cart_items IS 'Shopping cart — items not yet confirmed as an order';


-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES — improve query performance on common lookups
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_products_sku       ON products(sku);
CREATE INDEX idx_products_category  ON products(category);
CREATE INDEX idx_orders_user_id     ON orders(user_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_cart_user_id       ON cart_items(user_id);
CREATE INDEX idx_order_items_order  ON order_items(order_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA — 2 Demo Users
-- Passwords are bcrypt hashes of the plain-text values shown in comments.
-- Generated with: python -c "import bcrypt; print(bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode())"
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO users (name, email, hashed_password, role) VALUES
(
    'Alice Kamau',
    'admin@smartwholesaler.com',
    -- Plain text: admin123  (hash generated at seed time — yours will differ)
    '$2b$12$PLACEHOLDER_DISTRIBUTOR_HASH_REPLACE_WITH_REAL_BCRYPT',
    'distributor'
),
(
    'Brian Otieno',
    'retailer@smartwholesaler.com',
    -- Plain text: retailer123
    '$2b$12$PLACEHOLDER_RETAILER_HASH_REPLACE_WITH_REAL_BCRYPT',
    'retailer'
);

-- NOTE: Run backend/seed.py to generate real bcrypt hashes automatically:
--   cd backend && python seed.py


-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA — 8 Smart Wholesaler (Secure-Duka) Products
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO products
    (name, sku, category, unit, unit_price, min_order_qty, stock_qty, description)
VALUES
(
    'Unga Pembe Wheat Flour',
    'SKU-001',
    'Flour & Grains',
    '50kg bag',
    2400.00, 5, 340,
    'High-quality wheat flour, ideal for baking and cooking. Consistent grind for professional kitchens.'
),
(
    'Kabras Sugar',
    'SKU-002',
    'Sugar & Sweeteners',
    '50kg bag',
    2100.00, 10, 220,
    'Premium refined white sugar from Kabras Sugar Factory. Perfect for bulk catering and retail.'
),
(
    'Bidco Cooking Oil',
    'SKU-003',
    'Cooking Oils',
    '20L jerry can',
    3800.00, 3, 95,
    'Pure vegetable cooking oil. Long shelf life, heart-healthy, suitable for frying, baking, and salads.'
),
(
    'Maize Meal (Posho)',
    'SKU-004',
    'Flour & Grains',
    '25kg bag',
    1350.00, 10, 410,
    'Finely milled white maize meal. The East African staple grain for ugali, porridge, and more.'
),
(
    'Brookside Fresh Milk',
    'SKU-005',
    'Dairy & Eggs',
    'crate (12x1L)',
    1440.00, 2, 60,
    'Fresh pasteurised whole milk. Rich in protein and calcium. Requires refrigerated transport.'
),
(
    'Ketepa Tea Bags',
    'SKU-006',
    'Beverages',
    'carton (25 x 50 bags)',
    4500.00, 1, 130,
    'Kenya''s favourite premium tea. Each carton contains 25 boxes of 50 tea bags.'
),
(
    'Iodized Table Salt',
    'SKU-007',
    'Sugar & Sweeteners',
    '50kg bag',
    1800.00, 5, 0,
    'Refined iodized table salt. Essential mineral, fine granulation for easy dissolving. Currently out of stock.'
),
(
    'Sunflower Oil (Pwani)',
    'SKU-008',
    'Cooking Oils',
    '10L jerry can',
    2100.00, 5, 180,
    'Light sunflower oil, rich in Vitamin E and perfect for stir-frying and salad dressings.'
);


-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES — run these to confirm the seed worked
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT id, name, role, email FROM users;
-- SELECT id, name, sku, category, unit_price, stock_qty FROM products ORDER BY id;
-- SELECT COUNT(*) AS total_products FROM products;

-- ═══════════════════════════════════════════════════════════════════════════
-- END OF SCHEMA
-- Smart Wholesaler (Secure-Duka) | BIT3208 | Week 5
-- GitHub: https://github.com/Josemuturi/Smart-Wholesaler-
-- ═══════════════════════════════════════════════════════════════════════════
