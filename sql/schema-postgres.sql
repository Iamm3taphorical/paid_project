-- =====================================================
-- Freelance Project Management System - PostgreSQL Schema
-- For Supabase
-- =====================================================

-- Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Base Entity: User (Generalization)
-- =====================================================

CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'service_provider')),
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Specialization: Customer (disjoint from User)
-- =====================================================

CREATE TABLE IF NOT EXISTS "Customer" (
    id INT PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
    address VARCHAR(255),
    phone VARCHAR(20)
);

-- =====================================================
-- Specialization: ServiceProvider (disjoint from User)
-- =====================================================

CREATE TABLE IF NOT EXISTS "ServiceProvider" (
    id INT PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- =====================================================
-- Entity: Job
-- =====================================================

CREATE TABLE IF NOT EXISTS "Job" (
    "J_id" SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Multi-valued Attribute: JobLocation
-- =====================================================

CREATE TABLE IF NOT EXISTS "JobLocation" (
    "J_id" INT NOT NULL REFERENCES "Job"("J_id") ON DELETE CASCADE,
    location VARCHAR(200) NOT NULL,
    PRIMARY KEY ("J_id", location)
);

-- =====================================================
-- Entity: Service
-- =====================================================

CREATE TABLE IF NOT EXISTS "Service" (
    "S_id" SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- =====================================================
-- Entity: Payment
-- =====================================================

CREATE TABLE IF NOT EXISTS "Payment" (
    "P_id" SERIAL PRIMARY KEY,
    due_date DATE NOT NULL,
    method VARCHAR(20) NOT NULL DEFAULT 'bank_transfer' CHECK (method IN ('bank_transfer', 'credit_card', 'cash', 'online')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    payment_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Entity: Review
-- =====================================================

CREATE TABLE IF NOT EXISTS "Review" (
    "R_id" SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    comment TEXT
);

-- =====================================================
-- Relationship: Requests (Customer requests Job)
-- =====================================================

CREATE TABLE IF NOT EXISTS "Requests" (
    customer_id INT NOT NULL REFERENCES "Customer"(id) ON DELETE CASCADE,
    "J_id" INT NOT NULL REFERENCES "Job"("J_id") ON DELETE CASCADE,
    PRIMARY KEY (customer_id, "J_id")
);

-- =====================================================
-- Relationship: Involves (Job involves Payment)
-- =====================================================

CREATE TABLE IF NOT EXISTS "Involves" (
    "J_id" INT NOT NULL REFERENCES "Job"("J_id") ON DELETE CASCADE,
    "P_id" INT NOT NULL REFERENCES "Payment"("P_id") ON DELETE CASCADE,
    PRIMARY KEY ("J_id", "P_id")
);

-- =====================================================
-- Relationship: Requires (Job requires Service)
-- =====================================================

CREATE TABLE IF NOT EXISTS "Requires" (
    "J_id" INT NOT NULL REFERENCES "Job"("J_id") ON DELETE CASCADE,
    "S_id" INT NOT NULL REFERENCES "Service"("S_id") ON DELETE CASCADE,
    PRIMARY KEY ("J_id", "S_id")
);

-- =====================================================
-- Relationship: Writes (Customer writes Review for Job)
-- =====================================================

CREATE TABLE IF NOT EXISTS "Writes" (
    customer_id INT NOT NULL REFERENCES "Customer"(id) ON DELETE CASCADE,
    "J_id" INT NOT NULL REFERENCES "Job"("J_id") ON DELETE CASCADE,
    "R_id" INT NOT NULL REFERENCES "Review"("R_id") ON DELETE CASCADE,
    PRIMARY KEY (customer_id, "J_id", "R_id")
);

-- =====================================================
-- Relationship: Provides (ServiceProvider provides Service)
-- =====================================================

CREATE TABLE IF NOT EXISTS "Provides" (
    provider_id INT NOT NULL REFERENCES "ServiceProvider"(id) ON DELETE CASCADE,
    "S_id" INT NOT NULL REFERENCES "Service"("S_id") ON DELETE CASCADE,
    PRIMARY KEY (provider_id, "S_id")
);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert Users (Service Provider)
INSERT INTO "User" (email, user_type, name, password) VALUES
('john.dev@freelance.com', 'service_provider', 'John Developer', 'password123'),
('jane.designer@freelance.com', 'service_provider', 'Jane Designer', 'password123')
ON CONFLICT (email) DO NOTHING;

-- Insert Service Providers
INSERT INTO "ServiceProvider" (id, specialization, hourly_rate)
SELECT id, 'Full Stack Development', 75.00 FROM "User" WHERE email = 'john.dev@freelance.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "ServiceProvider" (id, specialization, hourly_rate)
SELECT id, 'UI/UX Design', 65.00 FROM "User" WHERE email = 'jane.designer@freelance.com'
ON CONFLICT (id) DO NOTHING;

-- Insert Users (Customers)
INSERT INTO "User" (email, user_type, name, password) VALUES
('alice@techcorp.com', 'customer', 'Alice Johnson', 'password123'),
('bob@startup.io', 'customer', 'Bob Smith', 'password123'),
('carol@enterprise.com', 'customer', 'Carol Williams', 'password123')
ON CONFLICT (email) DO NOTHING;

-- Insert Customers
INSERT INTO "Customer" (id, address, phone)
SELECT id, '123 Tech Street, Silicon Valley', '+1-555-0101' FROM "User" WHERE email = 'alice@techcorp.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Customer" (id, address, phone)
SELECT id, '456 Startup Ave, New York', '+1-555-0102' FROM "User" WHERE email = 'bob@startup.io'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Customer" (id, address, phone)
SELECT id, '789 Enterprise Blvd, Chicago', '+1-555-0103' FROM "User" WHERE email = 'carol@enterprise.com'
ON CONFLICT (id) DO NOTHING;

-- Insert Services
INSERT INTO "Service" (name, description) VALUES
('Web Development', 'Full-stack web application development'),
('Mobile App Development', 'iOS and Android app development'),
('UI/UX Design', 'User interface and experience design'),
('Database Design', 'Database architecture and optimization'),
('API Development', 'RESTful and GraphQL API development')
ON CONFLICT DO NOTHING;

-- Insert Jobs
INSERT INTO "Job" (title, description, status, total_amount, datetime) VALUES
('E-commerce Platform', 'Build a complete e-commerce solution', 'completed', 15000.00, CURRENT_TIMESTAMP - INTERVAL '30 days'),
('Mobile Banking App', 'Develop a secure mobile banking application', 'ongoing', 25000.00, CURRENT_TIMESTAMP - INTERVAL '15 days'),
('Corporate Website Redesign', 'Redesign and modernize corporate website', 'ongoing', 8000.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
('Inventory Management System', 'Build inventory tracking system', 'completed', 12000.00, CURRENT_TIMESTAMP - INTERVAL '60 days'),
('Social Media Dashboard', 'Analytics dashboard for social media', 'ongoing', 10000.00, CURRENT_TIMESTAMP - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Insert JobLocations
INSERT INTO "JobLocation" ("J_id", location) VALUES
(1, 'Remote'),
(1, 'San Francisco'),
(2, 'New York'),
(3, 'Chicago'),
(4, 'Remote'),
(5, 'Los Angeles')
ON CONFLICT DO NOTHING;

-- Insert Payments
INSERT INTO "Payment" (due_date, method, payment_status, amount, payment_date) VALUES
(CURRENT_DATE - INTERVAL '25 days', 'bank_transfer', 'paid', 15000.00, CURRENT_DATE - INTERVAL '28 days'),
(CURRENT_DATE + INTERVAL '15 days', 'credit_card', 'pending', 25000.00, NULL),
(CURRENT_DATE + INTERVAL '5 days', 'online', 'pending', 8000.00, NULL),
(CURRENT_DATE - INTERVAL '55 days', 'bank_transfer', 'paid', 12000.00, CURRENT_DATE - INTERVAL '50 days'),
(CURRENT_DATE + INTERVAL '20 days', 'credit_card', 'pending', 10000.00, NULL)
ON CONFLICT DO NOTHING;

-- Insert Reviews
INSERT INTO "Review" (date, comment) VALUES
(CURRENT_DATE - INTERVAL '25 days', 'Excellent work! The e-commerce platform exceeded our expectations.'),
(CURRENT_DATE - INTERVAL '50 days', 'Great job on the inventory system. Very reliable.')
ON CONFLICT DO NOTHING;

-- Link Jobs to Customers (Requests)
INSERT INTO "Requests" (customer_id, "J_id")
SELECT u.id, 1 FROM "User" u WHERE u.email = 'alice@techcorp.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Requests" (customer_id, "J_id")
SELECT u.id, 2 FROM "User" u WHERE u.email = 'bob@startup.io'
ON CONFLICT DO NOTHING;

INSERT INTO "Requests" (customer_id, "J_id")
SELECT u.id, 3 FROM "User" u WHERE u.email = 'carol@enterprise.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Requests" (customer_id, "J_id")
SELECT u.id, 4 FROM "User" u WHERE u.email = 'alice@techcorp.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Requests" (customer_id, "J_id")
SELECT u.id, 5 FROM "User" u WHERE u.email = 'bob@startup.io'
ON CONFLICT DO NOTHING;

-- Link Jobs to Payments (Involves)
INSERT INTO "Involves" ("J_id", "P_id") VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)
ON CONFLICT DO NOTHING;

-- Link Jobs to Services (Requires)
INSERT INTO "Requires" ("J_id", "S_id") VALUES
(1, 1), (1, 4), (2, 2), (2, 5), (3, 3), (4, 1), (4, 4), (5, 1), (5, 3)
ON CONFLICT DO NOTHING;

-- Link Reviews to Customers and Jobs (Writes)
INSERT INTO "Writes" (customer_id, "J_id", "R_id")
SELECT u.id, 1, 1 FROM "User" u WHERE u.email = 'alice@techcorp.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Writes" (customer_id, "J_id", "R_id")
SELECT u.id, 4, 2 FROM "User" u WHERE u.email = 'alice@techcorp.com'
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Schema and seed data created successfully!' as message;
