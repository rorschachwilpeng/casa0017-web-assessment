const express = require('express');
const router = express.Router();
const db = require('../db/index');

/**
 * 获取所有座位状态
 * @route GET /api/seats
 */
router.get('/seats', async (req, res) => {
  try {
    console.log('Starting to fetch seats...');
    const { session_id } = req.query;
    
    // 检查现有座位（针对特定场次）
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

    // 保持原有的返回格式
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
 * 更新座位状态
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
 * 初始化座位数据
 */
async function initializeSeats() {
  try {
    console.log('Starting seat initialization...')
    
    // 使用单个 INSERT 语句
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
 * 添加重置座位状态的路由
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

// 测试获取影院列表
router.get('/seats/test-cinemas', async (req, res) => {
  try {
    const sql = 'SELECT cinema_id, name FROM cinemas WHERE cinema_id <= 10 ORDER BY cinema_id';
    const [cinemaResults] = await db.query(sql);
    
    // 使用更清晰的响应结构
    res.json({
      status: 0,
      message: 'Success',
      cinemaData: cinemaResults.map(cinema => ({
        id: cinema.cinema_id,
        name: cinema.name
      }))
    });
  } catch (err) {
    console.error('获取影院数据失败:', err);
    res.status(500).json({ 
      status: 1,
      message: '获取影院数据失败',
      error: err.message 
    });
  }
});

// 获取电影列表
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
    console.error('获取电影数据失败:', err);
    res.status(500).json({ 
      status: 1,
      message: '获取电影数据失败',
      error: err.message 
    });
  }
});

// 添加新的路由处理会话数据
router.post('/seats/sessions', async (req, res) => {
  try {
    const { movie_id, theater_id, date, time } = req.body;

    // 验证必要字段
    if (!movie_id || !theater_id || !date || !time) {
      return res.status(400).json({
        status: 1,
        message: 'Missing required fields'
      });
    }

    // 先查询是否存在匹配的场次
    const [existingSessions] = await db.query(
      'SELECT id FROM sessions WHERE movie_id = ? AND theater_id = ? AND date = ? AND time = ?',
      [movie_id, theater_id, date, time]
    );

    let session_id;

    if (existingSessions.length > 0) {
      // 如果找到匹配的场次，使用现有的 session_id
      session_id = existingSessions[0].id;
      console.log('Found existing session:', session_id);
    } else {
      // 如果没有找到匹配的场次，创建新的场次
      const [result] = await db.query(
        'INSERT INTO sessions (movie_id, theater_id, date, time) VALUES (?, ?, ?, ?)',
        [movie_id, theater_id, date, time]
      );
      session_id = result.insertId;
      console.log('Created new session:', session_id);

      // 为新场次初始化座位
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

    // 获取该场次的所有座位信息
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