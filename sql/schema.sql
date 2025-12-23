-- =====================================================
-- Freelance Project Management System - Database Schema
-- CSE370 Database Project
-- =====================================================
-- This schema is FIXED and follows the exact ER diagram.
-- Do not modify without explicit instruction.
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+06:00";

-- =====================================================
-- Base Entity: User (Generalization)
-- =====================================================

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type ENUM('customer', 'service_provider') NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Specialization: Customer (disjoint from User)
-- =====================================================

CREATE TABLE Customer (
    id INT PRIMARY KEY,
    address VARCHAR(255),
    phone VARCHAR(20),
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Specialization: ServiceProvider (disjoint from User)
-- =====================================================

CREATE TABLE ServiceProvider (
    id INT PRIMARY KEY,
    specialization VARCHAR(100),
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Entity: Job
-- =====================================================

CREATE TABLE Job (
    J_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'ongoing',
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Multi-valued Attribute: JobLocation
-- =====================================================

CREATE TABLE JobLocation (
    J_id INT NOT NULL,
    location VARCHAR(200) NOT NULL,
    PRIMARY KEY (J_id, location),
    FOREIGN KEY (J_id) REFERENCES Job(J_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Entity: Service
-- =====================================================

CREATE TABLE Service (
    S_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Entity: Payment
-- =====================================================

CREATE TABLE Payment (
    P_id INT PRIMARY KEY AUTO_INCREMENT,
    due_date DATE NOT NULL,
    method ENUM('bank_transfer', 'credit_card', 'cash', 'online') NOT NULL DEFAULT 'bank_transfer',
    payment_status ENUM('pending', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'pending',
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    payment_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Entity: Review
-- =====================================================

CREATE TABLE Review (
    R_id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL DEFAULT (CURRENT_DATE),
    comment TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Relationship: Requests (Customer requests Job)
-- =====================================================

CREATE TABLE Requests (
    id INT NOT NULL,
    J_id INT NOT NULL,
    PRIMARY KEY (id, J_id),
    FOREIGN KEY (id) REFERENCES Customer(id) ON DELETE CASCADE,
    FOREIGN KEY (J_id) REFERENCES Job(J_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Relationship: Requires (Job requires Service)
-- =====================================================

CREATE TABLE Requires (
    J_id INT NOT NULL,
    S_id INT NOT NULL,
    PRIMARY KEY (J_id, S_id),
    FOREIGN KEY (J_id) REFERENCES Job(J_id) ON DELETE CASCADE,
    FOREIGN KEY (S_id) REFERENCES Service(S_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Relationship: Offers (ServiceProvider offers Service)
-- =====================================================

CREATE TABLE Offers (
    id INT NOT NULL,
    S_id INT NOT NULL,
    PRIMARY KEY (id, S_id),
    FOREIGN KEY (id) REFERENCES ServiceProvider(id) ON DELETE CASCADE,
    FOREIGN KEY (S_id) REFERENCES Service(S_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Relationship: Involves (Job involves Payment)
-- =====================================================

CREATE TABLE Involves (
    J_id INT NOT NULL,
    P_id INT NOT NULL,
    PRIMARY KEY (J_id, P_id),
    FOREIGN KEY (J_id) REFERENCES Job(J_id) ON DELETE CASCADE,
    FOREIGN KEY (P_id) REFERENCES Payment(P_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Relationship: Gives (Customer gives Review)
-- =====================================================

CREATE TABLE Gives (
    id INT NOT NULL,
    R_id INT NOT NULL,
    PRIMARY KEY (id, R_id),
    FOREIGN KEY (id) REFERENCES Customer(id) ON DELETE CASCADE,
    FOREIGN KEY (R_id) REFERENCES Review(R_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Relationship: ReviewForJob (Review is for Job)
-- =====================================================

CREATE TABLE ReviewForJob (
    R_id INT NOT NULL,
    J_id INT NOT NULL,
    PRIMARY KEY (R_id, J_id),
    FOREIGN KEY (R_id) REFERENCES Review(R_id) ON DELETE CASCADE,
    FOREIGN KEY (J_id) REFERENCES Job(J_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert Users (Customers)
INSERT INTO User (email, user_type, name, password) VALUES
('john.doe@email.com', 'customer', 'John Doe', '$2y$10$hashedpassword1'),
('jane.smith@email.com', 'customer', 'Jane Smith', '$2y$10$hashedpassword2'),
('acme.corp@email.com', 'customer', 'Acme Corporation', '$2y$10$hashedpassword3'),
('startup.inc@email.com', 'customer', 'Startup Inc', '$2y$10$hashedpassword4'),
('big.enterprise@email.com', 'customer', 'Big Enterprise', '$2y$10$hashedpassword5');

-- Insert Customers
INSERT INTO Customer (id, address, phone) VALUES
(1, '123 Main St, New York, NY', '+1-555-0101'),
(2, '456 Oak Ave, Los Angeles, CA', '+1-555-0102'),
(3, '789 Corporate Blvd, Chicago, IL', '+1-555-0103'),
(4, '321 Innovation Dr, San Francisco, CA', '+1-555-0104'),
(5, '555 Enterprise Way, Seattle, WA', '+1-555-0105');

-- Insert Users (Service Providers)
INSERT INTO User (email, user_type, name, password) VALUES
('dev.mike@email.com', 'service_provider', 'Mike Developer', '$2y$10$hashedpassword6'),
('design.sarah@email.com', 'service_provider', 'Sarah Designer', '$2y$10$hashedpassword7'),
('market.tom@email.com', 'service_provider', 'Tom Marketer', '$2y$10$hashedpassword8');

-- Insert ServiceProviders
INSERT INTO ServiceProvider (id, specialization, hourly_rate) VALUES
(6, 'Full Stack Development', 75.00),
(7, 'UI/UX Design', 60.00),
(8, 'Digital Marketing', 50.00);

-- Insert Services
INSERT INTO Service (name, description) VALUES
('Web Development', 'Full-stack web application development'),
('Mobile App Development', 'iOS and Android app development'),
('UI/UX Design', 'User interface and experience design'),
('Logo Design', 'Brand identity and logo creation'),
('SEO Optimization', 'Search engine optimization services'),
('Content Marketing', 'Content strategy and creation'),
('Database Design', 'Database architecture and optimization'),
('API Development', 'RESTful API design and implementation');

-- Insert Jobs
INSERT INTO Job (title, description, datetime, status, total_amount) VALUES
('E-commerce Website', 'Build a complete e-commerce platform with payment integration', '2024-01-15 09:00:00', 'completed', 5000.00),
('Mobile Banking App', 'Develop a secure mobile banking application', '2024-02-01 10:00:00', 'completed', 12000.00),
('Restaurant Website Redesign', 'Modern redesign of existing restaurant website', '2024-03-10 11:00:00', 'completed', 2500.00),
('Marketing Campaign Dashboard', 'Analytics dashboard for marketing campaigns', '2024-04-05 14:00:00', 'ongoing', 3500.00),
('Inventory Management System', 'Custom inventory tracking system', '2024-05-20 09:30:00', 'ongoing', 8000.00),
('Social Media App', 'Social networking mobile application', '2024-06-15 10:00:00', 'ongoing', 15000.00),
('Corporate Website', 'Professional corporate website with CMS', '2024-07-01 09:00:00', 'completed', 4500.00),
('CRM System', 'Customer relationship management system', '2024-08-10 11:00:00', 'ongoing', 9500.00),
('E-learning Platform', 'Online learning management system', '2024-09-01 10:00:00', 'ongoing', 11000.00),
('Portfolio Website', 'Personal portfolio website', '2024-10-15 14:00:00', 'completed', 1500.00);

-- Insert Job Locations
INSERT INTO JobLocation (J_id, location) VALUES
(1, 'Remote'), (1, 'New York'),
(2, 'San Francisco'), (2, 'Remote'),
(3, 'Los Angeles'),
(4, 'Chicago'), (4, 'Remote'),
(5, 'Seattle'),
(6, 'Remote'),
(7, 'New York'), (7, 'Boston'),
(8, 'Chicago'),
(9, 'Remote'), (9, 'Austin'),
(10, 'Los Angeles');

-- Insert Requests (Customer requests Job)
INSERT INTO Requests (id, J_id) VALUES
(1, 1), (1, 4),
(2, 2), (2, 6),
(3, 3), (3, 7),
(4, 5), (4, 8),
(5, 9), (5, 10);

-- Insert Requires (Job requires Service)
INSERT INTO Requires (J_id, S_id) VALUES
(1, 1), (1, 3), (1, 7),
(2, 2), (2, 3), (2, 8),
(3, 1), (3, 3),
(4, 1), (4, 5), (4, 6),
(5, 1), (5, 7), (5, 8),
(6, 2), (6, 3),
(7, 1), (7, 3), (7, 4),
(8, 1), (8, 7), (8, 8),
(9, 1), (9, 2), (9, 3),
(10, 1), (10, 3);

-- Insert Offers (ServiceProvider offers Service)
INSERT INTO Offers (id, S_id) VALUES
(6, 1), (6, 2), (6, 7), (6, 8),
(7, 3), (7, 4),
(8, 5), (8, 6);

-- Insert Payments
INSERT INTO Payment (due_date, method, payment_status, amount, payment_date) VALUES
('2024-02-15', 'bank_transfer', 'paid', 5000.00, '2024-02-10'),
('2024-03-15', 'credit_card', 'paid', 12000.00, '2024-03-20'),
('2024-04-15', 'online', 'paid', 2500.00, '2024-04-10'),
('2024-05-15', 'bank_transfer', 'pending', 3500.00, NULL),
('2024-06-30', 'credit_card', 'pending', 8000.00, NULL),
('2024-07-30', 'online', 'pending', 15000.00, NULL),
('2024-08-15', 'bank_transfer', 'paid', 4500.00, '2024-08-12'),
('2024-09-30', 'credit_card', 'pending', 9500.00, NULL),
('2024-10-31', 'online', 'pending', 11000.00, NULL),
('2024-11-15', 'bank_transfer', 'paid', 1500.00, '2024-11-10'),
('2024-12-31', 'credit_card', 'pending', 2000.00, NULL),
('2025-01-15', 'online', 'pending', 3000.00, NULL);

-- Insert Involves (Job involves Payment)
INSERT INTO Involves (J_id, P_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- Insert Reviews
INSERT INTO Review (date, comment) VALUES
('2024-02-20', 'Excellent work! The website exceeded our expectations. Great attention to detail.'),
('2024-03-25', 'Good job on the mobile app. Minor delays but quality was excellent.'),
('2024-04-20', 'Amazing redesign! Our customers love the new look.'),
('2024-08-20', 'Professional and timely delivery. Great communication throughout.'),
('2024-11-20', 'Simple but effective portfolio. Happy with the result.');

-- Insert Gives (Customer gives Review)
INSERT INTO Gives (id, R_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(3, 4),
(5, 5);

-- Insert ReviewForJob (Review for Job)
INSERT INTO ReviewForJob (R_id, J_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 7),
(5, 10);
