const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mapbox API 配置
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2xpbXJvcnNjaGFjaCIsImEiOiJjbTViODhpOTUwYzBkMmpxb3Nvdmx6OGFqIn0.JenG29Zpk1FQLaStd3jOgQ';
const MAPBOX_API_URL = 'https://api.mapbox.com/directions/v5/mapbox';

// 添加路由级别的日志中间件
router.use((req, res, next) => {
  console.log('\n[Routes Router] ====== New Request ======');
  console.log(`[Routes Router] Time: ${new Date().toISOString()}`);
  console.log('[Routes Router] Full URL:', req.originalUrl);
  console.log('[Routes Router] Base URL:', req.baseUrl);
  console.log('[Routes Router] Path:', req.path);
  console.log('[Routes Router] Method:', req.method);
  console.log('[Routes Router] Headers:', req.headers);
  if (req.method !== 'GET') {
    console.log('[Routes Router] Body:', req.body);
  }
  next();
});

// 性能日志函数
function logPerformance(startTime, label) {
  const duration = Date.now() - startTime;
  console.log(`[Performance] ${label}: ${duration}ms`);
  return Date.now();
}

// 路由测试端点
router.get('/test', (req, res) => {
  console.log('[Route] Test endpoint hit');
  res.json({ message: 'Route service is working' });
});

// 简单路由测试
router.post('/test-calculate', (req, res) => {
  console.log('[Route] Test calculate endpoint hit');
  console.log('[Route] Request body:', req.body);
  res.json({
    status: 0,
    message: 'Test calculate endpoint working',
    data: {
      drive: {
        duration: '10 mins',
        distance: '5.0 km',
        path: [[51.5074, -0.1278], [51.5074, -0.1278]],
        steps: ['Start driving', 'Arrive at destination']
      }
    }
  });
});

// 路线计算接口
router.post('/calculate', async (req, res) => {
  console.log('\n[Route] ====== Starting route calculation ======');
  console.log(`[Route] Time: ${new Date().toISOString()}`);
  console.log('[Route] Request headers:', req.headers);
  console.log('[Route] Request body:', req.body);
  
  const startTime = Date.now();
  
  try {
    const { origin, destination } = req.body;
    
    // 验证请求数据
    if (!origin || !destination) {
      throw new Error('Missing origin or destination');
    }

    if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
      throw new Error('Invalid coordinates format');
    }

    // 构建基础坐标字符串
    const coordinateString = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    
    // 定义 Mapbox API 模式和对应的前端模式名称
    const modeMapping = {
      'driving-traffic': 'driving',
      'walking': 'walking',
      'cycling': 'cycling'
    };
    
    // 存储所有路线结果
    const routes = {};
    
    // 获取所有交通方式的路线
    for (const [mapboxMode, frontendMode] of Object.entries(modeMapping)) {
      const url = `${MAPBOX_API_URL}/${mapboxMode}/${coordinateString}`;
      console.log(`[Route] Fetching ${frontendMode} route...`);
      
      try {
        const response = await axios.get(url, {
          params: {
            access_token: MAPBOX_ACCESS_TOKEN,
            geometries: 'geojson',
            overview: 'full',
            steps: true
          },
          timeout: 5000
        });

        if (!response.data || !response.data.routes || !response.data.routes[0]) {
          console.warn(`[Route] No ${frontendMode} route found`);
          continue;
        }

        const route = response.data.routes[0];
        routes[frontendMode] = {
          duration: `${Math.round(route.duration / 60)} mins`,
          distance: `${(route.distance / 1000).toFixed(1)} km`,
          path: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
          steps: route.legs[0].steps.map(step => step.maneuver.instruction)
        };
        
        console.log(`[Route] ${frontendMode} route found: ${routes[frontendMode].distance}, ${routes[frontendMode].duration}`);
      } catch (error) {
        console.error(`[Route] Error fetching ${frontendMode} route:`, error.message);
      }
    }

    // 检查是否至少有一条路线
    if (Object.keys(routes).length === 0) {
      throw new Error('No routes found for any transport mode');
    }

    console.log('[Route] Route calculation successful');
    console.log('[Route] Available modes:', Object.keys(routes));
    console.log('[Route] Total time:', Date.now() - startTime, 'ms');

    res.json({
      status: 0,
      message: 'Success',
      data: routes
    });

  } catch (error) {
    console.error('[Route] Error:', error.message);
    console.error('[Route] Stack:', error.stack);
    
    res.status(500).json({
      status: 1,
      message: error.message || 'Internal server error',
      error: {
        type: error.name,
        details: error.message,
        time: new Date().toISOString()
      }
    });
  }
});

// 导出路由
console.log('[Route] Routes module loaded');
module.exports = router; 