const express = require('express');
const db = require('../db/index');
const router = express.Router();

/**
 * 获取电影列表
 * @route GET /api/movies
 */
router.get('/movies', (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM movies';
  let params = [];

  if (category && category !== 'All') {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      status: 0,
      message: 'Success',
      data: results
    });
  });
});

/**
 * 获取单个电影详情
 * @route GET /api/movies/:id
 */
router.get('/movies/:id', (req, res) => {
  const sql = 'SELECT * FROM movies WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ 
      status: 1,
      message: 'Movie not found'
    });
    res.json({
      status: 0,
      message: 'Success',
      data: results[0]
    });
  });
});

/**
 * 添加新电影
 * @route POST /api/movies
 */
router.post('/movies', (req, res) => {
  const { name, category, description, rating, length, poster_url } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({
      status: 1,
      message: 'Name and category are required'
    });
  }

  const sql = 'INSERT INTO movies (name, category, description, rating, length, poster_url) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, category, description, rating, length, poster_url], (err, result) => {
    if (err) return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
    
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
        poster_url
      }
    });
  });
});

/**
 * 更新电影信息
 * @route PUT /api/movies/:id
 */
router.put('/movies/:id', (req, res) => {
  const id = req.params.id;
  const { name, category, description, rating, length, poster_url } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({
      status: 1,
      message: 'Name and category are required'
    });
  }

  const sql = 'UPDATE movies SET name = ?, category = ?, description = ?, rating = ?, length = ?, poster_url = ? WHERE id = ?';
  db.query(sql, [name, category, description, rating, length, poster_url, id], (err, result) => {
    if (err) return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
    
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
        poster_url
      }
    });
  });
});

/**
 * 删除电影
 * @route DELETE /api/movies/:id
 */
router.delete('/movies/:id', (req, res) => {
  const sql = 'DELETE FROM movies WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
    
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
  });
});

module.exports = router; 