-- BIT3208: Advanced Web Design and Development
-- Week 6: Database Integration and CRUD Operations
-- Database Setup Script

CREATE DATABASE IF NOT EXISTS smart_wholesaler_db;
USE smart_wholesaler_db;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    min_order_qty INT NOT NULL DEFAULT 1 CHECK (min_order_qty >= 1),
    stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial products matching Smart Wholesaler catalog
INSERT INTO products (name, sku, category, unit, unit_price, min_order_qty, stock_qty, description) VALUES
('Unga Pembe Wheat Flour', 'SKU-001', 'Flour & Grains', '50kg bag', 2400.00, 5, 340, 'High-quality wheat flour, ideal for baking and cooking. Consistent grind for professional kitchens.'),
('Kabras Sugar', 'SKU-002', 'Sugar & Sweeteners', '50kg bag', 2100.00, 10, 220, 'Premium refined white sugar from Kabras Sugar Factory. Perfect for bulk catering and retail.'),
('Bidco Cooking Oil', 'SKU-003', 'Cooking Oils', '20L jerry can', 3800.00, 3, 95, 'Pure vegetable cooking oil. Long shelf life, heart-healthy, suitable for frying, baking, and salads.'),
('Maize Meal (Posho)', 'SKU-004', 'Flour & Grains', '25kg bag', 1350.00, 10, 410, 'Finely milled white maize meal. The East African staple grain for ugali, porridge, and more.');
