const express = require('express');
const router = express.Router();
const db = require('../db/index');

// Get all crime data
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM crimes');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).json({ message: 'Failed to fetch crime data' });
  }
});

// Get crime data for a specific area
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM crimes WHERE neighbourhood_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Crime data not found for this area' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching crime data for area:', error);
    res.status(500).json({ message: 'Failed to fetch area crime data' });
  }
});

// Get crime statistics summary
router.get('/stats/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total_areas,
        SUM(crime_count) as total_crimes,
        AVG(crime_count) as avg_crimes,
        MAX(crime_count) as max_crimes,
        MIN(crime_count) as min_crimes
      FROM crimes
    `);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching crime statistics:', error);
    res.status(500).json({ message: 'Failed to fetch crime statistics' });
  }
});

module.exports = router; 