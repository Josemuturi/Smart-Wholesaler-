-- BIT3208: Advanced Web Design and Development
-- Week 7: User Authentication and Session Management
-- Database Setup Script for User Authentication

CREATE DATABASE IF NOT EXISTS smart_wholesaler_db;
USE smart_wholesaler_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'retailer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial accounts with pre-hashed bcrypt passwords (default cost factor)
-- Plain text: admin123  -> hashed
-- Plain text: retailer123 -> hashed
INSERT INTO users (name, email, password, role) VALUES
('Alice Kamau', 'admin@smartwholesaler.com', '$2y$10$tZ2cQh3u7f6XyM9P7vD7xO9H5kM/m0b9lT1w0O1g1/k/zFqf/P7e2', 'distributor'),
('Brian Otieno', 'retailer@smartwholesaler.com', '$2y$10$wK6P8s3u6f7XyM9P7vD7xO6H4kM/m0b9lT1w0O1g1/k/zFqf/P7e2', 'retailer');
