const express = require('express');
const db = require('../db/index');
const router = express.Router();

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Return distance in meters
}

// Calculate distance factor
function calculateDistanceFactor(distance) {
  // Use exponential decay for greater impact at shorter distances
  return Math.exp(-distance / 500);
}

// Calculate time relevance factor
function calculateRecency(crimeDate) {
  const now = new Date();
  const crimeDateObj = new Date(crimeDate);
  const monthsDiff = (now.getFullYear() - crimeDateObj.getFullYear()) * 12 + 
                    (now.getMonth() - crimeDateObj.getMonth());
  // Use non-linear decay
  return Math.pow(0.9, monthsDiff);
}

// Calculate crime factor
function calculateCrimeFactor(crimeCount, maxCrimeCount, avgCrimeCount) {
  // Use Z-score normalization, then apply sigmoid function for non-linear transformation
  const zScore = (crimeCount - avgCrimeCount) / (maxCrimeCount - avgCrimeCount);
  return 100 / (1 + Math.exp(-2 * zScore)); // Sigmoid function to amplify differences
}

/**
 * Get all cinema information for a specified movie
 * @route GET /api/cinemas/movie/:movieId
 */
router.get('/cinemas/movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  console.log('Getting cinema info for movie ID:', movieId);

  try {
    // Build SQL query
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

    // Execute query
    const [results] = await db.query(sql, [movieId]);
    console.log('Number of results:', results.length);

    if (!results || results.length === 0) {
      console.log('No cinemas found');
      return res.json({
        status: 0,
        message: 'No cinemas found for this movie',
        data: []
      });
    }

    // Get crime data for safety calculation
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

    // Calculate crime statistics for normalization
    const maxCrimeCount = Math.max(...crimes.map(crime => crime.crime_count));
    const avgCrimeCount = crimes.reduce((sum, crime) => sum + crime.crime_count, 0) / crimes.length;
    
    // Process results and calculate safety scores
    const cinemas = await Promise.all(results.map(async (cinema) => {
      let totalImpact = 0;
      let totalWeight = 0;
      const nearbyAreas = [];

      crimes.forEach(crime => {
        const distance = calculateDistance(
          cinema.latitude, cinema.longitude,
          crime.latitude, crime.longitude
        );

        if (distance <= 2000) { // Consider crimes within 2000 meters
          const crimeFactor = calculateCrimeFactor(crime.crime_count, maxCrimeCount, avgCrimeCount);
          const distanceFactor = calculateDistanceFactor(distance);
          const recency = calculateRecency(crime.updated_at);
          
          const weightFactor = Math.pow(0.5 + (0.5 * recency), 2);
          
          const impact = crimeFactor * distanceFactor * weightFactor;
          totalImpact += impact;
          totalWeight += distanceFactor * weightFactor;

          if (distance <= 1000) { // Only show areas within 1000 meters
            nearbyAreas.push({
              area_name: crime.neighbourhood,
              distance: Math.round(distance),
              crime_count: crime.crime_count,
              impact: Math.round(impact * 100) / 100
            });
          }
        }
      });

      // Calculate final safety score
      let safetyScore = totalWeight > 0 
        ? 100 * Math.pow(1 - (totalImpact / (totalWeight * 200)), 1.5)
        : 100;
      
      // Normalize score to 0-100 range
      safetyScore = Math.max(0, Math.min(100, Math.round(safetyScore * 100) / 100));

      // Determine safety level based on score
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

    console.log('Number of processed cinemas:', cinemas.length);

    res.json({
      status: 0,
      message: 'Success',
      data: cinemas
    });

  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({
      status: 1,
      message: 'Database error',
      error: err.message
    });
  }
});

/**
 * Get cinema list with safety scores
 * @route GET /api/cinemas/with-safety
 */
router.get('/cinemas/with-safety', async (req, res) => {
  try {
    // 1. Get all cinemas
    const [cinemas] = await db.query('SELECT * FROM cinemas');
    console.log('\n=== Cinema Data Statistics ===');
    console.log('Total cinemas:', cinemas.length);
    
    // 2. Get all crime data
    const [crimes] = await db.query('SELECT * FROM crimes');
    console.log('\n=== Crime Data Statistics ===');
    console.log('Total areas:', crimes.length);
    
    // 3. Find maximum crime count and statistics
    const crimeStats = crimes.reduce((stats, crime) => {
      stats.total += crime.crime_count;
      stats.max = Math.max(stats.max, crime.crime_count);
      stats.min = Math.min(stats.min, crime.crime_count);
      return stats;
    }, { total: 0, max: 0, min: Infinity });
    
    const maxCrimeCount = crimeStats.max;
    const avgCrimeCount = crimeStats.total / crimes.length;
    
    console.log('\n=== Crime Data Analysis ===');
    console.log('Maximum crime count:', maxCrimeCount);
    console.log('Minimum crime count:', crimeStats.min);
    console.log('Average crime count:', Math.round(avgCrimeCount));
    
    // 4. Calculate safety score for each cinema
    const cinemasWithSafety = await Promise.all(cinemas.map(async (cinema) => {
      console.log(`\n=== Calculating safety score for cinema ${cinema.name} ===`);
      let totalImpact = 0;
      let totalWeight = 0;
      let impactDetails = [];
      
      crimes.forEach(crime => {
        const distance = calculateDistance(
          cinema.latitude, cinema.longitude,
          crime.latitude, crime.longitude
        );
        
        if (distance <= 3000) { // Consider crimes within 3km
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
      
      // Output details for top 5 areas with highest impact
      console.log('Top 5 areas with highest impact:');
      impactDetails.sort((a, b) => b.impact - a.impact)
        .slice(0, 5)
        .forEach(detail => {
          console.log(`- ${detail.area}:`);
          console.log(`  Distance: ${detail.distance}m`);
          console.log(`  Crime count: ${detail.crimeCount}`);
          console.log(`  Crime factor: ${detail.crimeFactor}`);
          console.log(`  Distance factor: ${detail.distanceFactor}`);
          console.log(`  Weight factor: ${detail.weightFactor}`);
          console.log(`  Total impact: ${detail.impact}`);
        });
      
      // Calculate final safety score
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
      
      console.log('Final safety score:', Math.round(finalSafetyScore * 100) / 100);
      
      return {
        ...cinema,
        safety_score: Math.round(finalSafetyScore * 100) / 100,
        safety_level: safetyLevel
      };
    }));
    
    console.log('\n=== Safety Score Statistics ===');
    const safetyStats = cinemasWithSafety.reduce((stats, cinema) => {
      stats.total += cinema.safety_score;
      stats.max = Math.max(stats.max, cinema.safety_score);
      stats.min = Math.min(stats.min, cinema.safety_score);
      return stats;
    }, { total: 0, max: 0, min: 100 });
    
    console.log('Highest safety score:', safetyStats.max);
    console.log('Lowest safety score:', safetyStats.min);
    console.log('Average safety score:', Math.round((safetyStats.total / cinemasWithSafety.length) * 100) / 100);
    
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

/**
 * Get safety information for a specific cinema
 * @route GET /api/cinemas/:id/safety
 */
router.get('/cinemas/:id/safety', async (req, res) => {
  try {
    // 1. Get specific cinema information
    const [cinemas] = await db.query('SELECT * FROM cinemas WHERE cinema_id = ?', [req.params.id]);
    if (cinemas.length === 0) {
      return res.status(404).json({
        status: 1,
        message: 'Cinema not found'
      });
    }
    const cinema = cinemas[0];
    
    // 2. Get all crime data
    const [crimes] = await db.query('SELECT * FROM crimes');
    
    // 3. Find maximum crime count
    const maxCrimeCount = Math.max(...crimes.map(crime => crime.crime_count));
    
    // 4. Calculate detailed safety information for this cinema
    let totalImpact = 0;
    let totalWeight = 0;
    const nearbyAreas = [];
    
    crimes.forEach(crime => {
      const distance = calculateDistance(
        cinema.latitude, cinema.longitude,
        crime.latitude, crime.longitude
      );
      
      if (distance <= 3000) { // Consider crimes within 3km
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
    
    // Calculate final safety score
    const finalSafetyScore = totalWeight > 0 
      ? Math.max(0, Math.min(100, 100 * (1 - (totalImpact / (totalWeight * 150)))))
      : 100;
    
    // Add safety level description
    let safetyLevel;
    if (finalSafetyScore >= 80) {
      safetyLevel = 'High Safety';
    } else if (finalSafetyScore >= 50) {
      safetyLevel = 'Medium Safety';
    } else {
      safetyLevel = 'Exercise Caution';
    }
    
    // Sort nearby areas by impact level
    nearbyAreas.sort((a, b) => b.impact - a.impact);
    
    res.json({
      status: 0,
      message: 'Success',
      data: {
        cinema_id: cinema.cinema_id,
        safety_score: Math.round(finalSafetyScore * 100) / 100,
        safety_level: safetyLevel,
        nearby_areas: nearbyAreas.slice(0, 5)
      }
    });
    
  } catch (err) {
    console.error('Error calculating cinema safety:', err);
    res.status(500).json({
      status: 1,
      message: 'Failed to calculate cinema safety',
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
    console.error('Fail to get cinema list:', error)
    res.status(500).json({
      status: 1,
      message: 'Fail to get cinema list',
      error: error.message
    })
  }
})

module.exports = router; 