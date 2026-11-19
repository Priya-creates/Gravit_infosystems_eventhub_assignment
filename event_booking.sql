-- ========================================================
-- Database Schema for Smart Event Booking System
-- Database: MySQL
-- File: event_booking.sql
-- ========================================================

CREATE DATABASE IF NOT EXISTS event_booking;
USE event_booking;

-- --------------------------------------------------------
-- 1. Table structure for table `events`
-- --------------------------------------------------------
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  img VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table structure for table `bookings`
-- --------------------------------------------------------
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  ticket_category VARCHAR(50) DEFAULT 'Standard',
  quantity INT NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_event
    FOREIGN KEY (event_id) REFERENCES events (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Seed Sample Data for `events`
-- --------------------------------------------------------
INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img) VALUES
(
  'Global Tech Summit 2026',
  'Join visionary founders, engineers, and researchers to explore breakthroughs in generative AI, quantum computing, and web3 scalability.',
  'San Francisco, CA, USA',
  '2026-12-15 09:30:00',
  250,
  242,
  1499.00,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
),
(
  'International Music & Sound Fest',
  'A multi-genre electric experience featuring legendary DJs, immersive laser projection mappings, and 3 days of sound discovery.',
  'Austin, TX, USA',
  '2026-11-28 17:00:00',
  500,
  488,
  899.00,
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'
),
(
  'Design & Creative Flow Conference',
  'Unlock modern design systems, human-centered UI/UX, micro-interactions, and 3D web typography with world-class product leaders.',
  'Bengaluru, Karnataka, India',
  '2026-12-05 10:00:00',
  180,
  165,
  649.00,
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
),
(
  'Cybersecurity & Cloud Defense Expo',
  'Defend future infrastructure. Hands-on penetration labs, zero-trust cloud architecture masterclasses, and executive briefings.',
  'London, United Kingdom',
  '2026-12-20 09:00:00',
  300,
  290,
  1199.00,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
),
(
  'Future of FinTech & DeFi Expo',
  'Accelerating open banking, regulatory compliance, zero-knowledge proofs, and automated micro-settlement systems.',
  'Dubai, United Arab Emirates',
  '2027-01-18 10:30:00',
  400,
  385,
  1350.00,
  'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80'
);

-- --------------------------------------------------------
-- 4. Seed Sample Data for `bookings`
-- --------------------------------------------------------
INSERT INTO bookings (event_id, name, email, mobile, ticket_category, quantity, total_amount, booking_date, status) VALUES
(1, 'Alex Mercer', 'alex.mercer@example.com', '+1-555-0192', 'VIP', 2, 2998.00, NOW() - INTERVAL 2 DAY, 'confirmed'),
(1, 'Sophia Patel', 'sophia.p@example.com', '+1-555-0144', 'Standard', 1, 1499.00, NOW() - INTERVAL 1 DAY, 'confirmed'),
(2, 'Marcus Vance', 'marcus.v@example.com', '+1-555-0188', 'Standard', 2, 1798.00, NOW() - INTERVAL 3 HOUR, 'confirmed'),
(3, 'Aarav Sharma', 'aarav.sharma@example.com', '+91-9876543210', 'VIP', 1, 973.50, NOW() - INTERVAL 5 HOUR, 'confirmed');
