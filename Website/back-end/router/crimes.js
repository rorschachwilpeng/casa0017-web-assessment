const express = require('express');
const router = express.Router();
const db = require('../db/index');

// 获取所有犯罪数据
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM crimes');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).json({ message: '获取犯罪数据失败' });
  }
});

// 获取特定区域的犯罪数据
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM crimes WHERE neighbourhood_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该区域的犯罪数据' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching crime data for area:', error);
    res.status(500).json({ message: '获取区域犯罪数据失败' });
  }
});

// 获取犯罪数据统计信息
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
    res.status(500).json({ message: '获取犯罪统计数据失败' });
  }
});

module.exports = router; 