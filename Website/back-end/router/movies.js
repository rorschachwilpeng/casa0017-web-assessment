const express = require('express');
const db = require('../db/index');
const router = express.Router();

/**
 * 获取电影列表
 * @route GET /api/movies
 */
router.get('/movies', (req, res) => {
  const sql = 'SELECT * FROM casa0017Moives';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      status: 0,
      message: '获取电影列表成功',
      data: results
    });
  });
});

/**
 * 获取单个电影详情
 * @route GET /api/movies/:id
 */
router.get('/movies/:id', (req, res) => {
  console.log('访问电影详情接口，ID:', req.params.id);
  const sql = 'SELECT * FROM casa0017Moives WHERE movie_id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ 
      status: 1,
      message: '电影不存在'
    });
    res.json({
      status: 0,
      message: '获取电影详情成功',
      data: results[0]
    });
  });
});

/**
 * 添加新电影
 * @route POST /api/movies
 */
router.post('/movies', (req, res) => {
  // 添加调试日志
  console.log('收到的请求体:', req.body);
  
  // 获取客户端提交的电影数据
  const { movie_name } = req.body;
  
  // 添加调试日志
  console.log('解析的电影名称:', movie_name);
  
  // 判断数据是否合法
  if (!movie_name) {
    console.log('电影名称为空');  // 添加调试日志
    return res.status(400).json({
      status: 1,
      message: '电影名称不能为空'
    });
  }

  // 插入新电影
  const sql = 'INSERT INTO casa0017Moives (movie_name) VALUES (?)';
  db.query(sql, [movie_name], (err, result) => {
    if (err) return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
    
    res.status(201).json({
      status: 0,
      message: '添加电影成功',
      data: {
        id: result.insertId,
        movie_name
      }
    });
  });
});

/**
 * 更新电影信息
 * @route PUT /api/movies/:id
 */
router.put('/movies/:id', (req, res) => {
  console.log('收到更新请求:', {
    id: req.params.id,
    body: req.body
  });
  
  // 获取电影 ID 和新的电影名称
  const id = req.params.id;
  const { movie_name } = req.body;
  
  // 判断数据是否合法
  if (!movie_name) {
    return res.status(400).json({
      status: 1,
      message: '电影名称不能为空'
    });
  }

  // 更新电影信息
  const sql = 'UPDATE casa0017Moives SET movie_name = ? WHERE movie_id = ?';
  db.query(sql, [movie_name, id], (err, result) => {
    if (err) return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: '要更新的电影不存在'
      });
    }
    
    res.json({
      status: 0,
      message: '更新电影成功',
      data: {
        id,
        movie_name
      }
    });
  });
});

/**
 * 删除电影
 * @route DELETE /api/movies/:id
 */
router.delete('/movies/:id', (req, res) => {
  console.log('收到删除请求，ID:', req.params.id);
  
  const id = req.params.id;
  
  // 删除电影
  const sql = 'DELETE FROM casa0017Moives WHERE movie_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ 
      status: 1,
      message: err.message 
    });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: '要删除的电影不存在'
      });
    }
    
    res.json({
      status: 0,
      message: '删除电影成功'
    });
  });
});

module.exports = router; 