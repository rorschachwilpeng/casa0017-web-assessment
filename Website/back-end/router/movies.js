const express = require('express');
const db = require('../db/index');
const router = express.Router();

/**
 * Get movie list
 * @route GET /api/movies
 */
router.get('/movies', async (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM movies';
  let params = [];

  if (category && category !== 'All') {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY created_at DESC';

  // Add debug logs
  console.log('Executing SQL:', sql, 'with params:', params);

  try {
    const [results] = await db.query(sql, params);
    
    // Add debug logs
    console.log('Query results:', results);

    res.json({
      status: 0,
      message: 'Success',
      data: results
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ 
      status: 1,
      message: 'Database error',
      error: err.message 
    });
  }
});

/**
 * Get single movie details
 * @route GET /api/movies/:id
 */
router.get('/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  console.log('Getting movie details, ID:', movieId);

  try {
    const sql = 'SELECT * FROM movies WHERE id = ?';
    const [results] = await db.query(sql, [movieId]);
    
    if (!results || results.length === 0) {
      return res.status(404).json({
        status: 1,
        message: 'Movie not found'
      });
    }

    res.json({
      status: 0,
      message: 'Success',
      data: results[0]
    });

  } catch (err) {
    console.error('Failed to get movie details:', err);
    res.status(500).json({
      status: 1,
      message: 'Failed to get movie details',
      error: err.message
    });
  }
});

/**
 * Add new movie
 * @route POST /api/movies
 */
router.post('/movies', async (req, res) => {
  const { name, category, description, rating, length, poster_url, director, cast, plot_summary } = req.body;
  
  console.log('Received POST request with data:', req.body);
  
  if (!name || !category) {
    console.log('Validation failed: missing name or category');
    return res.status(400).json({
      status: 1,
      message: 'Name and category are required'
    });
  }

  const sql = 'INSERT INTO movies (name, category, description, rating, length, poster_url, director, cast, plot_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [name, category, description, rating, length, poster_url, director, cast, plot_summary];
  
  console.log('Executing SQL:', sql, 'with params:', params);

  try {
    const [result] = await db.query(sql, params);
    console.log('Insert result:', result);
    
    res.status(201).json({
      status: 0,
      message: 'Movie added successfully',
      data: {
        id: result.insertId,
        name,
        category,
        description,
        rating,
        length,
        poster_url,
        director,
        cast,
        plot_summary
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
  }
});

/**
 * Update movie information
 * @route PUT /api/movies/:id
 */
router.put('/movies/:id', async (req, res) => {
  const id = req.params.id;
  const { name, category, description, rating, length, poster_url, director, cast, plot_summary } = req.body;
  
  console.log('Received PUT request for id:', id, 'with data:', req.body);
  
  if (!name || !category) {
    console.log('Validation failed: missing name or category');
    return res.status(400).json({
      status: 1,
      message: 'Name and category are required'
    });
  }

  const sql = 'UPDATE movies SET name = ?, category = ?, description = ?, rating = ?, length = ?, poster_url = ?, director = ?, cast = ?, plot_summary = ? WHERE id = ?';
  const params = [name, category, description, rating, length, poster_url, director, cast, plot_summary, id];
  
  console.log('Executing SQL:', sql, 'with params:', params);

  try {
    const [result] = await db.query(sql, params);
    console.log('Update result:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: 'Movie not found'
      });
    }
    
    res.json({
      status: 0,
      message: 'Movie updated successfully',
      data: {
        id,
        name,
        category,
        description,
        rating,
        length,
        poster_url,
        director,
        cast,
        plot_summary
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
  }
});

/**
 * Delete movie
 * @route DELETE /api/movies/:id
 */
router.delete('/movies/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: 'Movie not found'
      });
    }
    
    res.json({
      status: 0,
      message: 'Movie deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
  }
});

/**
 * Get movie reviews
 * @route GET /api/movies/:id/reviews
 */
router.get('/movies/:id/reviews', async (req, res) => {
  const movieId = req.params.id;
  console.log('Getting movie reviews, ID:', movieId);

  try {
    const sql = `
      SELECT DISTINCT
        review_id,
        movie_id,
        reviewer_name,
        rating,
        comment,
        review_date
      FROM movie_reviews 
      WHERE movie_id = ?
      ORDER BY review_date DESC
    `;
    
    const [results] = await db.query(sql, [movieId]);
    console.log('Query results:', results);

    res.json({
      status: 0,
      message: results.length ? 'Success' : 'No reviews found',
      data: results
    });

  } catch (err) {
    console.error('Failed to get movie reviews:', err);
    res.status(500).json({
      status: 1,
      message: 'Failed to get movie reviews',
      error: err.message
    });
  }
});

module.exports = router;
