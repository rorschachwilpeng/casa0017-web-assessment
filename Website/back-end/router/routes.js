const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mapbox API Configuration
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2xpbXJvcnNjaGFjaCIsImEiOiJjbTViODhpOTUwYzBkMmpxb3Nvdmx6OGFqIn0.JenG29Zpk1FQLaStd3jOgQ';
const MAPBOX_API_URL = 'https://api.mapbox.com/directions/v5/mapbox';

// Add router level logging middleware
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

// Performance logging function
function logPerformance(startTime, label) {
  const duration = Date.now() - startTime;
  console.log(`[Performance] ${label}: ${duration}ms`);
  return Date.now();
}

// Test endpoint
router.get('/test', (req, res) => {
  console.log('[Route] Test endpoint hit');
  res.json({ message: 'Route service is working' });
});

// Simple route test
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

// Route calculation endpoint
router.post('/calculate', async (req, res) => {
  console.log('\n[Route] ====== Starting route calculation ======');
  console.log(`[Route] Time: ${new Date().toISOString()}`);
  console.log('[Route] Request headers:', req.headers);
  console.log('[Route] Request body:', req.body);
  
  const startTime = Date.now();
  
  try {
    const { origin, destination } = req.body;
    
    // Validate request data
    if (!origin || !destination) {
      throw new Error('Missing origin or destination');
    }

    if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
      throw new Error('Invalid coordinates format');
    }

    // Build base coordinate string
    const coordinateString = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    
    // Define Mapbox API modes and corresponding frontend mode names
    const modeMapping = {
      'driving-traffic': 'driving',
      'walking': 'walking',
      'cycling': 'cycling'
    };
    
    // Store all route results
    const routes = {};
    
    // Get routes for all transportation modes
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

    // Check if at least one route was found
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

// Export router
console.log('[Route] Routes module loaded');
module.exports = router; 