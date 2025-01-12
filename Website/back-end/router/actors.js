const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const names = req.query.names.split(',');
    console.log('Fetching actors:', names);

    const query = 'SELECT cast_name, picture FROM actors WHERE cast_name IN (?)';
    const [actors] = await db.query(query, [names]);
    
    console.log('Found actors:', actors);
    
    res.json({
      status: 0,
      data: actors
    });
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({ 
      status: 1,
      error: 'Failed to fetch actors data' 
    });
  }
});

module.exports = router;