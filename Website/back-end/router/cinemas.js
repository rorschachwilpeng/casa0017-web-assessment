const express = require('express');
const db = require('../db/index');
const router = express.Router();

/**
 * 获取指定电影的所有放映影院信息
 * @route GET /api/cinemas/movie/:movieId
 */
router.get('/cinemas/movie/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  console.log('=== 开始处理获取影院信息请求 ===');
  console.log('接收到的电影ID:', movieId);
  
  // 首先验证movieId是否存在
  if (!movieId) {
    console.log('错误：未提供电影ID');
    return res.status(400).json({
      status: 1,
      message: '未提供电影ID'
    });
  }

  // SQL查询：先从screenings表获取放映该电影的影院ID，然后关联cinemas表获取影院详情
  const sql = `
    SELECT 
      c.cinema_id,
      c.name,
      c.latitude,
      c.longitude,
      c.rating,
      c.location,
      c.phone,
      c.email,
      c.website,
      c.image_url,
      GROUP_CONCAT(DATE_FORMAT(s.show_time, '%Y-%m-%d %H:%i')) as screening_times
    FROM screenings s
    INNER JOIN cinemas c ON s.cinema_id = c.cinema_id
    WHERE s.movie_id = ?
    GROUP BY 
      c.cinema_id,
      c.name,
      c.latitude,
      c.longitude,
      c.rating,
      c.location,
      c.phone,
      c.email,
      c.website,
      c.image_url
    ORDER BY s.show_time ASC`;
  
  console.log('=== SQL查询信息 ===');
  console.log('SQL语句:', sql);
  console.log('查询参数:', [movieId]);
  
  // 执行查询
  db.query(sql, [movieId], (err, results) => {
    if (err) {
      console.error('=== 数据库查询错误 ===');
      console.error('错误详情:', err);
      return res.status(500).json({ 
        status: 1,
        message: 'Database error',
        error: err.message 
      });
    }

    console.log('=== 查询结果 ===');
    console.log('原始结果:', results);
    console.log('结果数量:', results.length);

    // 检查结果是否为空
    if (!results || results.length === 0) {
      console.log('未找到相关影院信息');
      return res.json({
        status: 0,
        message: 'No cinemas found for this movie',
        data: []
      });
    }

    // 处理结果，将放映时间字符串转换为数组，并格式化返回数据
    const cinemas = results.map(cinema => {
      console.log('处理影院数据:', cinema.cinema_id);
      console.log('放映时间字符串:', cinema.screening_times);
      
      return {
        id: cinema.cinema_id,  // 为了保持前端兼容性，将cinema_id映射为id
        name: cinema.name,
        latitude: cinema.latitude,
        longitude: cinema.longitude,
        rating: cinema.rating,
        location: cinema.location,
        phone: cinema.phone,
        email: cinema.email,
        website: cinema.website,
        image: cinema.image_url,
        screenings: cinema.screening_times ? cinema.screening_times.split(',') : []
      };
    });

    console.log('=== 最终处理结果 ===');
    console.log('处理后的影院数据:', cinemas);

    res.json({
      status: 0,
      message: 'Success',
      data: cinemas
    });
  });
});

module.exports = router; 