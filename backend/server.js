// ========================================
// Backend API Server (ES Modules)
// Swiss Concert Events Platform
// ========================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database/db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON request bodies

// ========================================
// API ENDPOINTS
// ========================================

// Root endpoint - Test if server is running
app.get('/', (req, res) => {
  res.json({ 
    message: '🎸 Welcome to Swiss Concert Events API!',
    endpoints: {
      allEvents: '/api/events',
      eventsByLocation: '/api/events/location/:location',
      locations: '/api/locations'
    }
  });
});

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events ORDER BY event_date'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch events',
      message: err.message
    });
  }
});

// GET events by location
app.get('/api/events/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const result = await pool.query(
      'SELECT * FROM events WHERE location = $1 ORDER BY event_date',
      [location]
    );
    res.json({
      success: true,
      location: location,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching events by location:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch events',
      message: err.message
    });
  }
});

// GET all unique locations
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT location FROM events ORDER BY location'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows.map(row => row.location)
    });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch locations',
      message: err.message
    });
  }
});

// POST - Create new event
app.post('/api/events', async (req, res) => {
  try {
    const { name, location, description, event_date } = req.body;
    
    // Validation
    if (!name || !location || !event_date) {
      return res.status(400).json({
        success: false,
        error: 'Name, location, and event_date are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO events (name, location, description, event_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, location, description, event_date]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create event',
      message: err.message
    });
  }
});

// PUT - Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, event_date } = req.body;

    const result = await pool.query(
      'UPDATE events SET name = $1, location = $2, description = $3, event_date = $4 WHERE id = $5 RETURNING *',
      [name, location, description, event_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
      message: err.message
    });
  }
});

// DELETE - Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      message: err.message
    });
  }
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/events`);
});