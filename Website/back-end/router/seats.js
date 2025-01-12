const express = require('express');
const router = express.Router();
const db = require('../db/index');

/**
 * Get all seat statuses
 * @route GET /api/seats
 */
router.get('/seats', async (req, res) => {
  try {
    console.log('Starting to fetch seats...');
    const { session_id } = req.query;
    
    // Check existing seats (for specific session)
    const [existingSeats] = await db.query(
      'SELECT COUNT(*) as count FROM seats WHERE session_id = ?',
      [session_id]
    );
    console.log('Existing seats count:', existingSeats[0].count);
    
    if (existingSeats[0].count === 0) {
      console.log('No seats found for this session');
      return res.json({
        status: 0,
        message: 'Success',
        data: []
      });
    }

    console.log('Fetching seats for session:', session_id);
    const [seats] = await db.query(
      'SELECT * FROM seats WHERE session_id = ? ORDER BY seat_row, seat_col',
      [session_id]
    );
    console.log(`Found ${seats.length} seats`);

    res.json({
      status: 0,
      message: 'Success',
      data: seats
    });
  } catch (error) {
    console.error('Error in /seats route:', error);
    res.status(500).json({
      status: 1,
      message: 'Failed to fetch seats',
      error: error.message
    });
  }
});

/**
 * Update seat status
 * @route POST /api/seats/reserve
 */
router.post('/seats/reserve', async (req, res) => {
  console.log('Received request body:', req.body);
  const { seats } = req.body;
  
  if (!Array.isArray(seats) || seats.length === 0) {
    console.log('Invalid seats data');
    return res.status(400).json({
      status: 1,
      message: 'Invalid seats data'
    });
  }

  try {
    console.log('Starting transaction for seats:', seats);
    await db.query('START TRANSACTION');

    const seatIds = seats.map(seat => seat.id);
    console.log('Checking seats with IDs:', seatIds);
    
    const [currentStatus] = await db.query(
      'SELECT id, status FROM seats WHERE id IN (?)',
      [seatIds]
    );
    console.log('Current seat status:', currentStatus);

    if (currentStatus.length !== seatIds.length) {
      console.log('Some seats not found');
      await db.query('ROLLBACK');
      return res.status(400).json({
        status: 1,
        message: 'Some seats not found'
      });
    }

    const unavailableSeats = currentStatus.filter(seat => seat.status !== 'available');
    if (unavailableSeats.length > 0) {
      console.log('Found unavailable seats:', unavailableSeats);
      await db.query('ROLLBACK');
      return res.status(400).json({
        status: 1,
        message: 'Some seats are no longer available'
      });
    }

    console.log('Updating seats status...');
    await db.query(
      'UPDATE seats SET status = "occupied" WHERE id IN (?)',
      [seatIds]
    );

    await db.query('COMMIT');
    console.log('Transaction committed successfully');
    
    const response = {
      status: 0,
      message: 'Seats reserved successfully'
    };
    console.log('Sending response:', response);
    return res.json(response);
  } catch (error) {
    console.error('Error in seat reservation:', error);
    await db.query('ROLLBACK');
    return res.status(500).json({
      status: 1,
      message: 'Failed to reserve seats',
      error: error.message
    });
  }
});

/**
 * Initialize seat data
 */
async function initializeSeats() {
  try {
    console.log('Starting seat initialization...')
    
    // Use single INSERT statement
    const values = []
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    
    for (const row of rows) {
      for (let col = 1; col <= 10; col++) {
        values.push([row, col, 1, 'available'])
      }
    }

    await db.query(
      'INSERT INTO seats (seat_row, seat_col, session_id, status) VALUES ?',
      [values]
    )
    
    console.log('Seats initialized successfully')
  } catch (error) {
    console.error('Error initializing seats:', error)
    throw error
  }
}

/**
 * Add route to reset seat status
 * @route POST /api/seats/reset
 */
router.post('/seats/reset', async (req, res) => {
  try {
    await db.query('UPDATE seats SET status = ?', ['available']);
    
    res.json({
      status: 0,
      message: 'All seats reset to available'
    });
  } catch (error) {
    console.error('Error resetting seats:', error);
    res.status(500).json({
      status: 1,
      message: 'Failed to reset seats',
      error: error.message
    });
  }
});

// Test getting cinema list
router.get('/seats/test-cinemas', async (req, res) => {
  try {
    const sql = 'SELECT cinema_id, name FROM cinemas WHERE cinema_id <= 10 ORDER BY cinema_id';
    const [cinemaResults] = await db.query(sql);
    
    // Use clearer response structure
    res.json({
      status: 0,
      message: 'Success',
      cinemaData: cinemaResults.map(cinema => ({
        id: cinema.cinema_id,
        name: cinema.name
      }))
    });
  } catch (err) {
    console.error('Failed to fetch cinema data:', err);
    res.status(500).json({ 
      status: 1,
      message: 'Failed to fetch cinema data',
      error: err.message 
    });
  }
});

// Get movie list
router.get('/seats/movies', async (req, res) => {
  try {
    const sql = 'SELECT id, name, poster_url, length FROM movies ORDER BY id';
    const [results] = await db.query(sql);
    
    res.json({
      status: 0,
      message: 'Success',
      movieData: results.map(movie => ({
        id: movie.id,
        name: movie.name,
        poster_url: movie.poster_url,
        length: movie.length
      }))
    });
  } catch (err) {
    console.error('Failed to fetch movie data:', err);
    res.status(500).json({ 
      status: 1,
      message: 'Failed to fetch movie data',
      error: err.message 
    });
  }
});

// Add new route to handle session data
router.post('/seats/sessions', async (req, res) => {
  try {
    const { movie_id, theater_id, date, time } = req.body;

    // Validate required fields
    if (!movie_id || !theater_id || !date || !time) {
      return res.status(400).json({
        status: 1,
        message: 'Missing required fields'
      });
    }

    // Check if matching session exists
    const [existingSessions] = await db.query(
      'SELECT id FROM sessions WHERE movie_id = ? AND theater_id = ? AND date = ? AND time = ?',
      [movie_id, theater_id, date, time]
    );

    let session_id;

    if (existingSessions.length > 0) {
      // If matching session found, use existing session_id
      session_id = existingSessions[0].id;
      console.log('Found existing session:', session_id);
    } else {
      // If no matching session found, create new session
      const [result] = await db.query(
        'INSERT INTO sessions (movie_id, theater_id, date, time) VALUES (?, ?, ?, ?)',
        [movie_id, theater_id, date, time]
      );
      session_id = result.insertId;
      console.log('Created new session:', session_id);

      // Initialize seats for new session
      const values = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      
      for (const row of rows) {
        for (let col = 1; col <= 10; col++) {
          values.push([row, col, session_id, 'available']);
        }
      }

      await db.query(
        'INSERT INTO seats (seat_row, seat_col, session_id, status) VALUES ?',
        [values]
      );
    }

    // Get all seat information for this session
    const [seats] = await db.query(
      'SELECT * FROM seats WHERE session_id = ? ORDER BY seat_row, seat_col',
      [session_id]
    );

    res.json({
      status: 0,
      message: 'Success',
      data: {
        session_id,
        seats
      }
    });

  } catch (error) {
    console.error('Error handling session:', error);
    res.status(500).json({
      status: 1,
      message: 'Failed to handle session',
      error: error.message
    });
  }
});

module.exports = router;