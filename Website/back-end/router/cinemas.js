const express = require('express');
const db = require('../db/index');
const router = express.Router();

// 计算两点之间的距离（Haversine公式）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 地球半径（米）
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 返回距离（米）
}

// 计算距离因子
function calculateDistanceFactor(distance) {
  // 使用指数衰减，让近距离的影响更大
  return Math.exp(-distance / 500);
}

// 计算时间相关性因子
function calculateRecency(crimeDate) {
  const now = new Date();
  const crimeDateObj = new Date(crimeDate);
  const monthsDiff = (now.getFullYear() - crimeDateObj.getFullYear()) * 12 + 
                    (now.getMonth() - crimeDateObj.getMonth());
  // 使用非线性衰减
  return Math.pow(0.9, monthsDiff);
}

// 计算犯罪因子
function calculateCrimeFactor(crimeCount, maxCrimeCount, avgCrimeCount) {
  // 使用Z-score标准化，然后应用sigmoid函数进行非线性变换
  const zScore = (crimeCount - avgCrimeCount) / (maxCrimeCount - avgCrimeCount);
  return 100 / (1 + Math.exp(-2 * zScore)); // sigmoid函数放大差异
}

/**
 * 获取指定电影的所有放映影院信息
 * @route GET /api/cinemas/movie/:movieId
 */
router.get('/cinemas/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  console.log('获取电影ID:', movieId, '的影院信息');

  try {
    // 构建SQL查询
    const sql = `
      SELECT DISTINCT 
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
        GROUP_CONCAT(s.show_time) as screening_times
      FROM cinemas c
      JOIN screenings s ON c.cinema_id = s.cinema_id
      WHERE s.movie_id = ?
      GROUP BY c.cinema_id
    `;

    // 执行查询
    const [results] = await db.query(sql, [movieId]);
    console.log('查询结果数量:', results.length);

    if (!results || results.length === 0) {
      console.log('未找到相关影院信息');
      return res.json({
        status: 0,
        message: 'No cinemas found for this movie',
        data: []
      });
    }

    // 获取犯罪数据
    const [crimes] = await db.query(`
      SELECT 
        id,
        neighbourhood_id,
        neighbourhood_name as neighbourhood,
        latitude,
        longitude,
        crime_count,
        created_at,
        updated_at
      FROM crimes
    `);

    // 计算犯罪统计信息
    const maxCrimeCount = Math.max(...crimes.map(crime => crime.crime_count));
    const avgCrimeCount = crimes.reduce((sum, crime) => sum + crime.crime_count, 0) / crimes.length;
    
    // 处理结果，添加安全分数
    const cinemas = await Promise.all(results.map(async (cinema) => {
      let totalImpact = 0;
      let totalWeight = 0;
      const nearbyAreas = [];

      crimes.forEach(crime => {
        const distance = calculateDistance(
          cinema.latitude, cinema.longitude,
          crime.latitude, crime.longitude
        );

        if (distance <= 2000) { // 缩小影响范围到2000米
          const crimeFactor = calculateCrimeFactor(crime.crime_count, maxCrimeCount, avgCrimeCount);
          const distanceFactor = calculateDistanceFactor(distance);
          const recency = calculateRecency(crime.updated_at);
          
          const weightFactor = Math.pow(0.5 + (0.5 * recency), 2);
          
          const impact = crimeFactor * distanceFactor * weightFactor;
          totalImpact += impact;
          totalWeight += distanceFactor * weightFactor;

          if (distance <= 1000) { // 只显示1000米内的区域
            nearbyAreas.push({
              area_name: crime.neighbourhood,
              distance: Math.round(distance),
              crime_count: crime.crime_count,
              impact: Math.round(impact * 100) / 100
            });
          }
        }
      });

      // 计算最终安全分数
      let safetyScore = totalWeight > 0 
        ? 100 * Math.pow(1 - (totalImpact / (totalWeight * 200)), 1.5)
        : 100;
      
      // 标准化分数到0-100区间
      safetyScore = Math.max(0, Math.min(100, Math.round(safetyScore * 100) / 100));

      // 调整安全等级阈值
      let safetyLevel;
      if (safetyScore >= 75) {
        safetyLevel = 'High Safety';
      } else if (safetyScore >= 45) {
        safetyLevel = 'Medium Safety';
      } else {
        safetyLevel = 'Exercise Caution';
      }

      return {
        ...cinema,
        safety_score: safetyScore,
        safety_level: safetyLevel,
        nearby_areas: nearbyAreas.slice(0, 5).sort((a, b) => b.impact - a.impact)
      };
    }));

    console.log('处理后的影院数据数量:', cinemas.length);

    res.json({
      status: 0,
      message: 'Success',
      data: cinemas
    });

  } catch (err) {
    console.error('数据库查询错误:', err);
    res.status(500).json({
      status: 1,
      message: 'Database error',
      error: err.message
    });
  }
});

// 获取带有安全分数的影院列表
router.get('/cinemas/with-safety', async (req, res) => {
  try {
    // 1. 获取所有影院
    const [cinemas] = await db.query('SELECT * FROM cinemas');
    console.log('\n=== 影院数据统计 ===');
    console.log('总影院数量:', cinemas.length);
    
    // 2. 获取所有犯罪数据
    const [crimes] = await db.query('SELECT * FROM crimes');
    console.log('\n=== 犯罪数据统计 ===');
    console.log('总区域数量:', crimes.length);
    
    // 3. 找出最高犯罪数和统计信息
    const crimeStats = crimes.reduce((stats, crime) => {
      stats.total += crime.crime_count;
      stats.max = Math.max(stats.max, crime.crime_count);
      stats.min = Math.min(stats.min, crime.crime_count);
      return stats;
    }, { total: 0, max: 0, min: Infinity });
    
    const maxCrimeCount = crimeStats.max;
    const avgCrimeCount = crimeStats.total / crimes.length;
    
    console.log('\n=== 犯罪数据分析 ===');
    console.log('最高犯罪数:', maxCrimeCount);
    console.log('最低犯罪数:', crimeStats.min);
    console.log('平均犯罪数:', Math.round(avgCrimeCount));
    
    // 4. 为每个影院计算安全分数
    const cinemasWithSafety = await Promise.all(cinemas.map(async (cinema) => {
      console.log(`\n=== 计算影院 ${cinema.name} 的安全分数 ===`);
      let totalImpact = 0;
      let totalWeight = 0;
      let impactDetails = [];
      
      crimes.forEach(crime => {
        const distance = calculateDistance(
          cinema.latitude, cinema.longitude,
          crime.latitude, crime.longitude
        );
        
        if (distance <= 3000) {
          const crimeFactor = calculateCrimeFactor(crime.crime_count, maxCrimeCount);
          const distanceFactor = calculateDistanceFactor(distance);
          const recency = calculateRecency(crime.updated_at);
          const weightFactor = 0.7 + (0.3 * recency);
          
          const impact = crimeFactor * distanceFactor * weightFactor;
          totalImpact += impact;
          totalWeight += distanceFactor * weightFactor;
          
          impactDetails.push({
            area: crime.neighbourhood,
            distance: Math.round(distance),
            crimeCount: crime.crime_count,
            crimeFactor: Math.round(crimeFactor * 100) / 100,
            distanceFactor: Math.round(distanceFactor * 100) / 100,
            weightFactor: Math.round(weightFactor * 100) / 100,
            impact: Math.round(impact * 100) / 100
          });
        }
      });
      
      // 输出影响最大的5个区域的详细信息
      console.log('影响最大的5个区域:');
      impactDetails.sort((a, b) => b.impact - a.impact)
        .slice(0, 5)
        .forEach(detail => {
          console.log(`- ${detail.area}:`);
          console.log(`  距离: ${detail.distance}米`);
          console.log(`  犯罪数: ${detail.crimeCount}`);
          console.log(`  犯罪因子: ${detail.crimeFactor}`);
          console.log(`  距离因子: ${detail.distanceFactor}`);
          console.log(`  权重因子: ${detail.weightFactor}`);
          console.log(`  总影响: ${detail.impact}`);
        });
      
      // 计算最终安全分数
      const finalSafetyScore = totalWeight > 0 
        ? Math.max(0, Math.min(100, 100 * (1 - (totalImpact / (totalWeight * 150)))))
        : 100;
      
      let safetyLevel;
      if (finalSafetyScore >= 80) {
        safetyLevel = 'High Safety';
      } else if (finalSafetyScore >= 50) {
        safetyLevel = 'Medium Safety';
      } else {
        safetyLevel = 'Exercise Caution';
      }
      
      console.log('最终安全分数:', Math.round(finalSafetyScore * 100) / 100);
      
      return {
        ...cinema,
        safety_score: Math.round(finalSafetyScore * 100) / 100,
        safety_level: safetyLevel
      };
    }));
    
    console.log('\n=== 安全分数统计 ===');
    const safetyStats = cinemasWithSafety.reduce((stats, cinema) => {
      stats.total += cinema.safety_score;
      stats.max = Math.max(stats.max, cinema.safety_score);
      stats.min = Math.min(stats.min, cinema.safety_score);
      return stats;
    }, { total: 0, max: 0, min: 100 });
    
    console.log('最高安全分数:', safetyStats.max);
    console.log('最低安全分数:', safetyStats.min);
    console.log('平均安全分数:', Math.round((safetyStats.total / cinemasWithSafety.length) * 100) / 100);
    
    res.json({
      status: 0,
      message: 'Success',
      data: cinemasWithSafety
    });
    
  } catch (err) {
    console.error('Error calculating safety scores:', err);
    res.status(500).json({
      status: 1,
      message: 'Failed to calculate safety scores',
      error: err.message
    });
  }
});

// 获取单个影院的安全信息
router.get('/cinemas/:id/safety', async (req, res) => {
  try {
    // 1. 获取指定影院信息
    const [cinemas] = await db.query('SELECT * FROM cinemas WHERE cinema_id = ?', [req.params.id]);
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 1,
        message: 'Cinema not found'
      });
    }
    const cinema = cinemas[0];
    
    // 2. 获取所有犯罪数据
    const [crimes] = await db.query('SELECT * FROM crimes');
    
    // 3. 找出最高犯罪数
    const maxCrimeCount = Math.max(...crimes.map(crime => crime.crime_count));
    
    // 4. 计算该影院的详细安全信息
    let totalImpact = 0;
    let totalWeight = 0;
    const nearbyAreas = [];
    
    crimes.forEach(crime => {
      const distance = calculateDistance(
        cinema.latitude, cinema.longitude,
        crime.latitude, crime.longitude
      );
      
      if (distance <= 3000) {
        const crimeFactor = calculateCrimeFactor(crime.crime_count, maxCrimeCount);
        const distanceFactor = calculateDistanceFactor(distance);
        const recency = calculateRecency(crime.updated_at);
        const weightFactor = 0.7 + (0.3 * recency);
        
        const impact = crimeFactor * distanceFactor * weightFactor;
        totalImpact += impact;
        totalWeight += distanceFactor * weightFactor;
        
        nearbyAreas.push({
          area_name: crime.neighbourhood,
          distance: Math.round(distance),
          crime_count: crime.crime_count,
          impact: Math.round(impact * 100) / 100
        });
      }
    });
    
    // 计算最终安全分数
    const finalSafetyScore = totalWeight > 0 
      ? Math.max(0, Math.min(100, 100 * (1 - (totalImpact / (totalWeight * 150)))))
      : 100;
    
    // 添加安全等级描述
    let safetyLevel;
    if (finalSafetyScore >= 80) {
      safetyLevel = 'High Safety';
    } else if (finalSafetyScore >= 50) {
      safetyLevel = 'Medium Safety';
    } else {
      safetyLevel = 'Exercise Caution';
    }
    
    // 按影响程度排序附近区域
    nearbyAreas.sort((a, b) => b.impact - a.impact);
    
    res.json({
      status: 0,
      message: 'Success',
      data: {
        cinema_id: cinema.cinema_id,
        cinema_name: cinema.name,
        safety_score: Math.round(finalSafetyScore * 100) / 100,
        safety_level: safetyLevel,
        nearby_areas: nearbyAreas.slice(0, 5) // 只返回影响最大的5个区域
      }
    });
    
  } catch (err) {
    console.error('Error calculating safety details:', err);
    res.status(500).json({
      status: 1,
      message: 'Failed to calculate safety details',
      error: err.message
    });
  }
});

router.get('/cinemas', async (req, res) => {
  try {
    const [cinemas] = await db.query(`
      SELECT 
        cinema_id,
        name,
        description,
        rating,
        image_url
      FROM cinemas
      ORDER BY rating DESC
      LIMIT 6
    `)
    
    res.json({
      status: 0,
      message: 'Success',
      data: cinemas
    })
  } catch (error) {
    console.error('获取影院列表失败:', error)
    res.status(500).json({
      status: 1,
      message: '获取影院列表失败',
      error: error.message
    })
  }
})

module.exports = router; 