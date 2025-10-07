-- ========================================
-- Database Schema
-- Swiss Concert Events Platform
-- ========================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS events;

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_location ON events(location);
CREATE INDEX idx_event_date ON events(event_date);