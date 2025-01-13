<template>
<<<<<<< HEAD
  <div class="app-container">
    <!-- 添加导航栏组件 -->
    <TheNavbar />
    
    <!-- 顶部电影信息 -->
    <div class="movie-header">
      <!-- 添加电影选择器 -->
      <div class="movie-selector">
        <span class="label">Select Movie:</span>
        <el-select 
          style="width: 300px"
          v-model="selectedMovieId" 
          placeholder="Please select a movie" 
          @change="handleMovieChange"
        >
          <el-option
            v-for="movie in moviesList"
            :key="movie.id"
            :label="movie.name"
            :value="movie.id"
          >
            <span style="float: left">{{ movie.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ movie.category }}
            </span>
          </el-option>
        </el-select>
      </div>

      <div v-if="movieTitle" class="movie-title">
        {{ movieTitle }}
      </div>
      
      <!-- 时间和筛选选项 -->
      <div class="filter-section">
        <div class="time-filter">
          <span class="label">Time:</span>
          <el-radio-group v-model="selectedTime" size="small">
            <el-radio-button label="today">today</el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="other-filters">
          <span class="label">Filter:</span>
          <el-radio-group v-model="selectedFilter" size="small">
            <el-radio-button label="closest">closest</el-radio-button>
            <el-radio-button label="highest-rated">highest rated</el-radio-button>
            <el-radio-button label="safest">safest</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧影院列表 -->
      <div class="cinemas-list">
        <div 
          v-for="cinema in sortedCinemas" 
          :key="cinema.cinema_id" 
          class="cinema-item" 
          :data-cinema-id="cinema.cinema_id"
          @click="selectCinema(cinema)"
        >
          <h3>{{ cinema.name }}</h3>
          <div class="cinema-info">
            <span class="distance">Distance: {{ cinema.distance }}km</span>
            <span class="rating">Rating: {{ cinema.rating }}</span>
          </div>
          <div class="safety-info" v-if="cinema.safety_score !== undefined">
            <span class="safety-score">Safety Score: {{ cinema.safety_score }}</span>
            <span class="safety-level" :class="cinema.safety_level.toLowerCase().replace(' ', '-')">
              {{ cinema.safety_level }}
            </span>
          </div>
          <div class="showtime-info">
            <span>Recent screenings:</span>
            <div class="times">
              <span v-for="(time, index) in cinema.screenings" :key="index">
                {{ time }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧地图区域 -->
      <div class="map-container">
        <div id="map"></div>
        
        <!-- 修改后的路线信息控件 -->
        <div v-if="routeInfo" class="route-info-control">
          <h4>Route Information</h4>
          <div class="route-modes">
            <div 
              v-for="(data, mode) in routeInfo" 
              :key="mode"
              class="route-mode-item"
              :class="{ active: selectedTransportMode === mode }"
              @click="handleTransportModeChange(mode)"
=======
  <div class="home">
    <!-- Navigation bar -->
    <TheNavbar />

    <div class="content-section">
      <!-- Main content -->
      <div class="app-container">
        <!-- Movie information header -->
        <div class="movie-header">
          <!-- Movie selector -->
          <div class="movie-selector">
            <span class="label">Select Movie:</span>
            <el-select
              style="width: 300px"
              v-model="selectedMovieId"
              placeholder="Please select a movie"
              @change="handleMovieChange"
>>>>>>> update-movie-details-ui
            >
              <!-- Movie options -->
              <el-option
                v-for="movie in moviesList"
                :key="movie.id"
                :label="movie.name"
                :value="movie.id"
              >
                <span style="float: left">{{ movie.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ movie.category }}
                </span>
              </el-option>
            </el-select>
          </div>

          <!-- Movie title display -->
          <div v-if="movieTitle" class="movie-title">
            {{ movieTitle }}
          </div>

          <!-- Filter section -->
          <div class="filter-section">
            <!-- Time filter -->
            <div class="time-filter">
              <span class="label">Time:</span>
              <div class="button-group">
                <!-- Time selection buttons -->
                <div 
                  class="button" 
                  :class="{ active: selectedTime === 'today' }"
                  @click="selectedTime = 'today'"
                >
                  today
                </div>
                <div 
                  class="button" 
                  :class="{ active: selectedTime === 'tomorrow' }"
                  @click="selectedTime = 'tomorrow'"
                >
                  tomorrow
                </div>
                <div class="button" @click="handleDateSelect">
                  <i class="el-icon-date"></i>
                  select
                </div>
              </div>
            </div>

            <!-- Additional filters -->
            <div class="other-filters">
              <span class="label">Filter:</span>
              <div class="button-group">
                <!-- Filter options -->
                <div 
                  class="button" 
                  :class="{ active: selectedFilter === 'closest' }"
                  @click="selectedFilter = 'closest'"
                >
                  closest
                </div>
                <div 
                  class="button" 
                  :class="{ active: selectedFilter === 'highest-rated' }"
                  @click="selectedFilter = 'highest-rated'"
                >
                  highest rated
                </div>
                <div 
                  class="button" 
                  :class="{ active: selectedFilter === 'safest' }"
                  @click="selectedFilter = 'safest'"
                >
                  safest
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main content area -->
        <div class="main-content">
          <!-- Cinema list -->
          <div class="cinemas-list">
            <!-- Individual cinema items -->
            <div
              v-for="cinema in sortedCinemas"
              :key="cinema.cinema_id"
              class="cinema-item"
              :data-cinema-id="cinema.cinema_id"
              @click="selectCinema(cinema)"
            >
              <h3>{{ cinema.name }}</h3>
              <!-- Cinema information -->
              <div class="cinema-info">
                <span class="distance">Distance: {{ cinema.distance }}km</span>
                <span class="rating">Rating: {{ cinema.rating }}</span>
              </div>
              <!-- Safety information -->
              <div class="safety-info" v-if="cinema.safety_score !== undefined">
                <span class="safety-score">Safety Score: {{ cinema.safety_score }}</span>
                <span class="safety-level" :class="cinema.safety_level.toLowerCase().replace(' ', '-')">
                  {{ cinema.safety_level }}
                </span>
              </div>
              <!-- Screening times -->
              <div class="showtime-info">
                <span>Recent screenings:</span>
                <div class="times">
                  <span v-for="(time, index) in cinema.screenings" :key="index">
                    {{ time }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Map container -->
          <div class="map-container">
            <div id="map"></div>

            <!-- Route information -->
            <div v-if="routeInfo" class="route-info-control">
              <h4>Route Information</h4>
              <!-- Transport mode options -->
              <div class="route-modes">
                <div
                  v-for="(data, mode) in routeInfo"
                  :key="mode"
                  class="route-mode-item"
                  :class="{ active: selectedTransportMode === mode }"
                  @click="handleTransportModeChange(mode)"
                >
                  <div class="mode-header">
                    <i :class="getTransportIcon(mode)"></i>
                    <span class="mode-name">{{ mode.charAt(0).toUpperCase() + mode.slice(1) }}</span>
                  </div>
                  <div class="mode-details">
                    <div class="detail-item">
                      <i class="el-icon-time" />
                      <span>{{ data.duration }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="el-icon-location-outline"></i>
                      <span>{{ data.distance }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map legend -->
            <div class="map-legend">
              <h4>Safety Score</h4>
              <div class="legend-items">
                <div class="legend-item">
                  <span class="color-box high-safety"></span>
                  <span>High Safety (80-100)</span>
                </div>
                <div class="legend-item">
                  <span class="color-box medium-safety"></span>
                  <span>Medium Safety (50-79)</span>
                </div>
                <div class="legend-item">
                  <span class="color-box low-safety"></span>
                  <span>Exercise Caution (0-49)</span>
                </div>
              </div>
            </div>
            <el-button
              class="location-button"
              type="primary"
              icon="el-icon-location"
              @click="getCurrentLocation"
            >
              Get My Location
            </el-button>
          </div>
        </div>

        <!-- Selected cinema details -->
        <div v-if="selectedCinema" class="cinema-details">
          <h2>{{ selectedCinema.name }}</h2>

          <!-- Cinema image -->
          <div class="cinema-images">
            <img
              :src="selectedCinema.image_url ? `http://localhost:3007${selectedCinema.image_url}` : ''"
              :alt="selectedCinema.name"
              class="cinema-image"
            >
          </div>

          <!-- Cinema information -->
          <div class="info-section">
            <div class="info-item safety-details" v-if="selectedCinema.safety_score !== undefined">
              <label>Safety Information:</label>
              <div class="safety-stats">
                <div class="safety-score">
                  <span class="label">Safety Score:</span>
                  <span class="value">{{ selectedCinema.safety_score }}</span>
                </div>
                <div class="safety-level" :class="selectedCinema.safety_level.toLowerCase().replace(' ', '-')">
                  {{ selectedCinema.safety_level }}
                </div>
              </div>
              <div class="nearby-areas" v-if="selectedCinema.nearby_areas">
                <h4>Nearby Areas Crime Statistics:</h4>
                <ul>
                  <li v-for="(area, index) in selectedCinema.nearby_areas" :key="index">
                    {{ area.area_name }} ({{ area.distance }}m) - {{ area.crime_count }} incidents
                  </li>
                </ul>
              </div>
            </div>

            <div class="info-item">
              <label>Comments:</label>
              <div class="comments">
                <p v-for="(comment, index) in selectedCinema.comments" :key="index">
                  {{ comment }}
                </p>
              </div>
            </div>

            <div class="info-item">
              <label>Location:</label>
              <p>{{ selectedCinema.location }}</p>
            </div>

            <div class="info-item">
              <label>Phone:</label>
              <p>{{ selectedCinema.phone }}</p>
            </div>

            <div class="info-item">
              <label>Email:</label>
              <p>{{ selectedCinema.email }}</p>
            </div>

            <div class="info-item">
              <label>Website:</label>
              <p>{{ selectedCinema.website }}</p>
            </div>
          </div>

          <!-- Route buttons -->
          <div class="route-buttons">
            <el-button type="primary" @click="showRoute">Route</el-button>
          </div>
        </div>

        <!-- Cinema selection hint -->
        <div v-else class="select-cinema-hint">
          <div class="hint-content">
            <i class="el-icon-film"></i>
            <span>Please select a cinema from the list or map to view details</span>
          </div>
        </div>

        <!-- Booking banner -->
        <div class="banner-section">
          <BookingBanner />
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script>
<<<<<<< HEAD
import TheNavbar from '@/components/TheNavbar.vue'
=======
// External dependencies
>>>>>>> update-movie-details-ui
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import request from '@/utils/request'
import axios from 'axios'

// Component imports
import TheNavbar from '@/components/TheNavbar.vue'
import BookingBanner from '@/components/BookingBanner.vue'
import TheFooter from '@/components/TheFooter.vue'

// Fix Leaflet icon path issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'CinemaSelect',
  components: {
<<<<<<< HEAD
    TheNavbar
=======
    TheNavbar,
    BookingBanner,
    TheFooter
>>>>>>> update-movie-details-ui
  },
  data() {
    return {
      moviesList: [], // Movie list
      selectedMovieId: null, // Selected movie ID
      movieTitle: '',
      selectedTime: 'today',
      selectedFilter: 'closest',
      selectedCinema: null,
      map: null,
      userMarker: null,
      cinemaMarkers: [],
      routePolylines: [], // Route polyline array
      userLocation: null,
      cinemas: [],
      loading: false,
      routeInfo: null, // Route information
      selectedTransportMode: 'driving' // Default selected transport mode
    }
  },
  computed: {
    sortedCinemas() {
      if (!this.cinemas.length) return [];

      let sorted = [...this.cinemas];

      if (this.selectedFilter === 'safest') {
        // Sort by safety score
        sorted = sorted.sort((a, b) => (b.safety_score || 0) - (a.safety_score || 0));
      } else if (this.selectedFilter === 'closest' && this.userLocation) {
        // Sort by distance
        sorted = sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      } else {
        // Sort by rating
        sorted = sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      }

      return sorted.slice(0, 5); // Return only the top 5 cinemas
    }
  },
  async created() {
    await this.fetchMovies()
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      // Initialize map centered on London
      this.map = L.map('map').setView([51.5074, -0.1278], 13)

      // Add map layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)

      // Add cinema markers
      this.addCinemaMarkers()
    },

    addCinemaMarkers() {
      // Clear existing markers
      this.cinemaMarkers.forEach(marker => marker.remove())
      this.cinemaMarkers = []

      // Add markers for each cinema
      this.cinemas.forEach(cinema => {
        // Create custom icon
        const safetyColor = this.getSafetyColor(cinema.safety_score)
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-content" style="background-color: ${safetyColor}">
              <span class="marker-icon">🎬</span>
              <span class="safety-score">${Math.round(cinema.safety_score)}</span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        })

        const marker = L.marker([cinema.latitude, cinema.longitude], { icon: customIcon })
          .bindPopup(`
            <div class="custom-popup">
              <h3>${cinema.name}</h3>
              <div class="popup-content">
                <div class="popup-info">
                  <p class="rating"><i class="el-icon-star-on"></i> ${cinema.rating}</p>
                  <p class="safety-info">
                    <span class="safety-score">Safety: ${Math.round(cinema.safety_score)}</span>
                    <span class="safety-level ${cinema.safety_level.toLowerCase().replace(' ', '-')}">
                      ${cinema.safety_level}
                    </span>
                  </p>
                  <p class="location"><i class="el-icon-location"></i> ${cinema.location}</p>
                </div>
                ${cinema.safety_score !== undefined ? `
                <div class="nearby-crimes">
                  <p><strong>Nearby Areas:</strong></p>
                  <ul>
                    ${cinema.nearby_areas.slice(0, 3).map(area => `
                      <li>${area.area_name}: ${area.crime_count} incidents</li>
                    `).join('')}
                  </ul>
                </div>
                ` : ''}
                <div class="popup-actions">
                  <button class="view-details" onclick="document.querySelector('[data-cinema-id=\\"${cinema.cinema_id}\\"]')?.click()">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          `, {
            maxWidth: 300,
            className: 'custom-popup-container'
          })
          .addTo(this.map)

        // If safety score exists, add circle to represent safety level
        if (cinema.safety_score !== undefined) {
          const circle = L.circle([cinema.latitude, cinema.longitude], {
            color: safetyColor,
            fillColor: safetyColor,
            fillOpacity: 0.1,
            radius: 500 // 500m radius
          }).addTo(this.map)

          this.cinemaMarkers.push(circle)
        }

        this.cinemaMarkers.push(marker)

        // Add click event
        marker.on('click', () => {
          this.selectCinema(cinema)
        })
      })
    },

    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.$message.error('Geolocation is not supported by your browser');
        return;
      }

      this.$message({
        message: 'Getting your location...',
        type: 'info'
      });

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.userLocation = { latitude, longitude };

          // Ensure map is initialized
          if (!this.map) {
            this.$message.error('Map is not initialized');
            return;
          }

          // Update or add user location marker
          if (this.userMarker) {
            this.userMarker.setLatLng([latitude, longitude]);
          } else {
            this.userMarker = L.marker([latitude, longitude])
              .addTo(this.map);
          }

          // Center map on user location
          this.map.setView([latitude, longitude], 13);

          // Update distances to all cinemas
          this.updateCinemaDistances();

          this.$message({
            message: 'Location found!',
            type: 'success'
          });
        },
        error => {
          this.$message.error('Unable to get your location: ' + error.message);
        }
      );
    },

    updateCinemaDistances() {
      if (!this.userLocation) return

      this.cinemas.forEach(cinema => {
        cinema.distance = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          cinema.latitude,
          cinema.longitude
        )
      })
    },

    selectCinema(cinema) {
      this.selectedCinema = cinema
      if (this.map) {
        this.map.setView([cinema.latitude, cinema.longitude], 15)
      }
    },

    // Get movie list
    async fetchMovies() {
      console.log('=== Starting to fetch movie list ===');
      try {
        const response = await request({
          url: '/api/movies',
          method: 'get'
        })
        console.log('Movie list response:', response);

        if (response && response.data) {
          this.moviesList = response.data
          console.log('Fetched movie list:', this.moviesList);

          // If there are movie data, default to the first one
          if (this.moviesList.length > 0) {
            this.selectedMovieId = this.moviesList[0].id
            console.log('Default selected movie ID:', this.selectedMovieId);
            await this.handleMovieChange(this.selectedMovieId)
          } else {
            console.log('No available movie data');
          }
        }
      } catch (error) {
        console.error('Failed to fetch movie list:', error)
        this.$message.error('Failed to load movies list')
      }
    },

    // Handle movie selection change
    async handleMovieChange(movieId) {
      if (!movieId) return

      console.log('=== Movie selection change ===');
      console.log('Selected movie ID:', movieId);

      this.movieTitle = this.moviesList.find(m => m.id === movieId)?.name || ''
      console.log('Movie title:', this.movieTitle);

      await this.fetchCinemas(movieId)
    },

    // Get cinema information
    async fetchCinemas(movieId) {
      console.log('=== Starting to fetch cinema information ===');
      console.log('Requested movie ID:', movieId);

      this.loading = true
      try {
        const response = await request({
          url: `/api/cinemas/movie/${movieId}`,
          method: 'get'
        })
        console.log('Cinema data response:', response);

        if (response && response.data) {
          this.cinemas = response.data.map(cinema => ({
            ...cinema,
            distance: '0',
            screenings: cinema.screening_times ? cinema.screening_times.split(',') : []
          }))
          console.log('Processed cinema data:', this.cinemas);

          // Ensure map is initialized
          if (!this.map) {
            this.initMap()
          }

          // Add or update cinema markers
          this.addCinemaMarkers()

          // If user location exists, update distances
          if (this.userLocation) {
            this.updateCinemaDistances()
          }

          // Adjust map view to show all cinemas
          if (this.cinemas.length > 0) {
            const bounds = L.latLngBounds(this.cinemas.map(cinema => [cinema.latitude, cinema.longitude]))
            this.map.fitBounds(bounds, { padding: [50, 50] })
          }
        }
      } catch (error) {
        console.error('Failed to fetch cinema data:', error)
        this.$message.error('Failed to load cinema data')
      } finally {
        this.loading = false
      }
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // Earth radius, in kilometers
      const dLat = this.deg2rad(lat2 - lat1)
      const dLon = this.deg2rad(lon2 - lon1)
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c // Distance, in kilometers
      return distance.toFixed(1) // Round to one decimal place
    },

    deg2rad(deg) {
      return deg * (Math.PI/180)
    },

    getSafetyColor(score) {
      if (score >= 80) return 'rgba(76, 175, 80, 0.9)' // Green - Safe
      if (score >= 50) return 'rgba(255, 193, 7, 0.9)' // Yellow - Medium
      return 'rgba(244, 67, 54, 0.9)' // Red - Needs attention
    },

    // Modify showRoute method
    async showRoute() {
      if (!this.userLocation || !this.selectedCinema) {
        this.$message.warning('Please get your location first');
        return;
      }

      try {
        // Prepare request data
        const requestData = {
          origin: {
            lat: Number(this.userLocation.latitude),
            lng: Number(this.userLocation.longitude)
          },
          destination: {
            lat: Number(this.selectedCinema.latitude),
            lng: Number(this.selectedCinema.longitude)
          }
        };

        console.log('\n[Route Frontend] ====== Starting Route Calculation ======');
        console.log('[Route Frontend] Request data:', JSON.stringify(requestData, null, 2));

        // Send route calculation request
        const response = await axios.post('http://localhost:3007/api/routes/calculate', requestData, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        console.log('[Route Frontend] Response received:', JSON.stringify(response.data, null, 2));

        if (response.data.status === 0 && response.data.data) {
          const routeData = response.data.data;
          console.log('\n[Route Frontend] Route data structure:', {
            availableModes: Object.keys(routeData),
            selectedMode: this.selectedTransportMode,
            hasDrivingRoute: !!routeData.driving,
            drivingPath: routeData.driving?.path ? 'exists' : 'missing'
          });

          this.routeInfo = routeData;
          this.drawRouteOnMap(routeData);
          this.$message.success('Route calculated successfully');
        } else {
          throw new Error('Invalid response format');
        }

      } catch (error) {
        console.error('\n[Route Frontend] ====== Route Calculation Failed ======');
        console.error('[Route Frontend] Error type:', error.name);
        console.error('[Route Frontend] Error message:', error.message);

        if (error.response) {
          console.error('[Route Frontend] Response status:', error.response.status);
          console.error('[Route Frontend] Response data:', error.response.data);
        } else if (error.request) {
          console.error('[Route Frontend] No response received');
        }

        this.$message.error(
          error.response?.data?.message ||
          'Failed to calculate route. Please try again.'
        );
      }
    },

    // Draw route on map
    drawRouteOnMap(routeInfo) {
      console.log('[Route] Starting to draw route with data:', JSON.stringify(routeInfo, null, 2));

      // Clear existing routes
      if (this.routePolylines) {
        this.routePolylines.forEach(line => {
          if (line && typeof line.remove === 'function') {
            line.remove();
          }
        });
      }
      this.routePolylines = [];

      // Get selected transport mode route
      const route = routeInfo[this.selectedTransportMode];
      console.log('[Route] Selected mode data:', {
        mode: this.selectedTransportMode,
        hasRoute: !!route,
        hasPath: route?.path ? 'yes' : 'no',
        pathType: route?.path ? typeof route.path : 'undefined',
        pathLength: route?.path?.length
      });

      if (!route || !route.path) {
        console.error(`[Route] No route found for ${this.selectedTransportMode} mode`);
        console.error('[Route] Available modes:', Object.keys(routeInfo));
        return;
      }

      // Validate path data
      if (!Array.isArray(route.path)) {
        console.error('[Route] Path is not an array:', route.path);
        return;
      }

      if (route.path.length === 0) {
        console.error('[Route] Path array is empty');
        return;
      }

      // Validate coordinate format
      const isValidCoordinate = coord =>
        Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number';

      if (!route.path.every(isValidCoordinate)) {
        console.error('[Route] Invalid coordinates in path:',
          route.path.find(coord => !isValidCoordinate(coord))
        );
        return;
      }

      try {
        // Use blue color
        const routeColor = '#409EFF';

        // Create route style
        const routeStyle = {
          color: routeColor,
          weight: 6,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        };

        console.log('[Route] Drawing path with', route.path.length, 'points');
        console.log('[Route] First point:', route.path[0]);
        console.log('[Route] Last point:', route.path[route.path.length - 1]);

        // Draw main route
        const polyline = L.polyline(route.path, routeStyle).addTo(this.map);
        this.routePolylines.push(polyline);

        // Adjust map view to show entire route
        this.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

        // Add start and end markers
        const startPoint = route.path[0];
        const endPoint = route.path[route.path.length - 1];

        // Create start marker
        const startIcon = L.divIcon({
          className: 'route-marker start-marker',
          html: `
            <div class="marker-container">
              <div class="marker-dot" style="background-color: ${routeColor};"></div>
              <div class="marker-pulse"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        // Create end marker
        const endIcon = L.divIcon({
          className: 'route-marker end-marker',
          html: `
            <div class="marker-container">
              <div class="marker-dot" style="background-color: ${routeColor};"></div>
              <div class="marker-pulse"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        // Add start and end markers
        const startMarker = L.marker(startPoint, { icon: startIcon }).addTo(this.map);
        const endMarker = L.marker(endPoint, { icon: endIcon }).addTo(this.map);
        this.routePolylines.push(startMarker, endMarker);

        console.log('[Route] Route drawn successfully');
      } catch (error) {
        console.error('[Route] Error drawing route:', error);
        console.error('[Route] Error stack:', error.stack);
        this.$message.error('Failed to draw route on map');
      }
    },

    handleTransportModeChange(mode) {
      console.log('[Route] Transport mode changed to:', mode);
      this.selectedTransportMode = mode; // First update selected transport mode
      if (this.routeInfo && this.routeInfo[mode]) {
        this.drawRouteOnMap(this.routeInfo);
      }
    },

    getTransportIcon(mode) {
      switch (mode) {
        case 'driving':
          return 'el-icon-position';
        case 'walking':
          return 'el-icon-user';
        case 'cycling':
          return 'el-icon-bicycle';
        default:
          return '';
      }
    },

    handleDateSelect() {
      // Handle date selection logic
      console.log('Open date selector');
    }
  },
  watch: {
    selectedFilter() {
      if (this.userLocation) {
        this.updateCinemaDistances()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  min-height: 100vh;
  background-color: #0A0A0A;
  color: #ffffff;
<<<<<<< HEAD
  padding: 80px 124px 60px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(26, 26, 26, 0.8) 5%,
    rgba(26, 26, 26, 1) 10%,
    rgba(26, 26, 26, 1) 100%
  );
=======
}

.content-section {
  padding: 0px 0px;

  /* Add this container style to maintain consistent content width */
  .container {
    padding: 0 124px;  // Use the same left and right padding as app-container
    margin: 0 auto;
    width: 100%;
  }
}

/* Global styles */
.app-container {
  width: 100%;
  min-height: 100vh;
  color: #ffffff;
  padding: 120px 124px 40px; // Reduce bottom padding to 60px
  background: transparent;
>>>>>>> update-movie-details-ui
}

.movie-header {
  margin-bottom: 20px;

  .movie-selector {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    .label {
      font-size: 14px;
      font-weight: bold;
      color: #606266;
    }
  }

  .movie-title {
    margin: 0 0 15px;
    font-size: 24px;
  }

  .filter-section {
    display: flex;
    gap: 20px;
    margin: 15px 0;

    .label {
      color: #ffffff;
      font-size: 14px;
      margin-right: 10px;
    }

    .button-group {
      display: flex;
      gap: 1px;

      .button {
        background: #333333;
        border: 1px solid #444444;
        color: #ffffff;
        height: 32px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        user-select: none;

        &:first-child {
          border-radius: 4px 0 0 4px;
        }

        &:last-child {
          border-radius: 0 4px 4px 0;
        }

        &:hover {
          background: #444444;
        }

        &.active {
          background: #666666;
          border-color: #666666;
        }

        i {
          margin-right: 5px;
        }
      }
    }

    .time-filter, 
    .other-filters {
      display: flex;
      align-items: center;
    }

    .other-filters {
      .button {
        min-width: 100px;
      }
    }
  }
}

.main-content {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.cinemas-list {
  flex: 0 0 300px;
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .cinema-item {
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      border-color: rgba(64, 158, 255, 0.5);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    h3 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
    }

    .cinema-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;

      span {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #999;
        font-size: 14px;

        i {
          color: #409EFF;
        }
      }
    }

    .safety-info {
      margin-bottom: 12px;
      padding: 8px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.2);

      .safety-score {
        font-weight: 500;
        color: #ffffff;
      }

      .safety-level {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        margin-left: 8px;
        font-size: 12px;

        &.high {
          background: rgba(76, 175, 80, 0.2);
          color: #81c784;
        }

        &.medium {
          background: rgba(255, 193, 7, 0.2);
          color: #ffd54f;
        }

        &.low {
          background: rgba(244, 67, 54, 0.2);
          color: #e57373;
        }
      }
    }

    .showtime-info {
      .times {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;

        span {
          padding: 4px 8px;
          background: rgba(64, 158, 255, 0.1);
          border-radius: 4px;
          color: #409EFF;
          font-size: 12px;

          &:hover {
            background: rgba(64, 158, 255, 0.2);
          }
        }
      }
    }
  }
}

.map-container {
  flex: 1;
  min-height: 400px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  #map {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }

  .location-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }

  .map-legend {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    z-index: 1000;

    h4 {
      margin: 0 0 10px;
      font-size: 14px;
      color: #333;
    }

    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;

      .color-box {
        width: 16px;
        height: 16px;
        border-radius: 4px;

        &.high-safety {
          background-color: rgba(76, 175, 80, 0.6);
        }

        &.medium-safety {
          background-color: rgba(255, 193, 7, 0.6);
        }

        &.low-safety {
          background-color: rgba(244, 67, 54, 0.6);
        }
      }
    }
  }
}

:global(.user-location-marker) {
  .marker-container {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .marker-dot {
    width: 14px;
    height: 14px;
    background: #409EFF;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .marker-pulse {
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(64, 158, 255, 0.4);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: 0.8;
    }
    70% {
      transform: scale(2);
      opacity: 0;
    }
    100% {
      transform: scale(0.5);
      opacity: 0;
    }
  }
}

:global(.leaflet-popup-content) {
  h3 {
    margin: 0 0 5px;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: #666;
  }
}

.cinema-details {
  background: #0A0A0A;
  color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    margin: 0 0 20px;
    color: #ffffff;
    font-size: 24px;
    font-weight: 600;
  }

  .info-section {
    margin-bottom: 20px;

    .info-item {
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);

      label {
        font-weight: 500;
        display: block;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
      }

      p {
        margin: 0;
        color: #ffffff;
        font-size: 16px;
      }

      .comments {
        p {
          margin-bottom: 8px;
          line-height: 1.5;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .safety-details {
      .safety-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .safety-score {
        .value {
          font-size: 28px;
          font-weight: bold;
          color: #409EFF;
        }
      }

      .nearby-areas {
        h4 {
          margin: 15px 0 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 8px 0;
            color: #ffffff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }

  .cinema-images {
    width: 225px;
    height: 225px;
    margin: 0 auto 20px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background-color: #1a1a1a;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .cinema-image {
    transition: opacity 0.3s ease;
  }

  .cinema-images {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .route-buttons {
    display: flex;
    gap: 15px;
    margin-top: 20px;

    .el-button {
      flex: 1;
      height: 40px;
      font-size: 16px;

      &.el-button--primary {
        background: #409EFF;
        border-color: #409EFF;

        &:hover {
          background: #66b1ff;
          border-color: #66b1ff;
        }
      }
    }
  }
}

.safety-info {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .safety-score {
    font-weight: bold;
  }

  .safety-level {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;

    &.high-safety {
      background-color: #E8F5E9;
      color: #4CAF50;
    }

    &.medium-safety {
      background-color: #FFF3E0;
      color: #FF9800;
    }

    &.exercise-caution {
      background-color: #FFEBEE;
      color: #F44336;
    }
  }
}

.safety-details {
  .safety-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .safety-score {
    .value {
      font-size: 24px;
      font-weight: bold;
      color: #409EFF;
    }
  }

  .nearby-areas {
    h4 {
      margin: 10px 0;
      color: #333;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 5px 0;
        color: #666;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

:global(.custom-marker) {
  .marker-content {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transform: rotate(0);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    .marker-icon {
      font-size: 16px;
      margin-bottom: 2px;
    }

    .safety-score {
      color: white;
      font-weight: bold;
      font-size: 12px;
    }
  }
}

:global(.custom-popup-container) {
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
    padding: 0;
  }

  .leaflet-popup-content {
    margin: 0;
    width: 280px !important;

    h3 {
      margin: 0;
      padding: 12px;
      font-size: 16px;
      color: #333;
      background: #f5f7fa;
      border-radius: 8px 8px 0 0;
    }

    .popup-content {
      padding: 12px;
    }

    .popup-info {
      margin-bottom: 10px;

      p {
        margin: 5px 0;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .rating {
        color: #F7BA2A;
        font-weight: bold;
      }

      .location {
        color: #666;
        font-size: 12px;
      }
    }

    .nearby-crimes {
      margin: 10px 0;
      padding-top: 10px;
      border-top: 1px solid #eee;

      p {
        margin: 5px 0;
        font-size: 12px;
      }

      ul {
        margin: 5px 0;
        padding-left: 20px;
        font-size: 12px;
        color: #666;
      }
    }

    .popup-actions {
      margin-top: 10px;
      text-align: center;

      .view-details {
        background: #409EFF;
        color: white;
        border: none;
        padding: 6px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.3s;

        &:hover {
          background: #66b1ff;
        }
      }
    }
  }
}

.route-details-control {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin: 10px;
  min-width: 280px;
  max-width: 350px;

  .route-info-panel {
    h4 {
      margin: 0 0 15px;
      color: #303133;
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    .route-summary {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .summary-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        background: #f5f7fa;
        border-radius: 6px;

        i {
          font-size: 24px;
          color: #409EFF;
        }

        .mode-info {
          flex: 1;

          .mode-name {
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .mode-details {
            display: flex;
            gap: 12px;
            color: #606266;
            font-size: 13px;

            span {
              display: inline-flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}

:global(.route-marker) {
  .marker-container {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .marker-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(0,0,0,0.3);
    z-index: 2;
  }

  .marker-pulse {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.3;
    animation: pulse 2s infinite;
  }

  .marker-label {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    color: #606266;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    70% {
      transform: scale(2);
      opacity: 0;
    }
    100% {
      transform: scale(0.5);
      opacity: 0;
    }
  }
}

.route-info-control {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.85);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 125px;
  backdrop-filter: blur(5px);

  h4 {
    margin: 0 0 8px;
    font-size: 12px;
    color: #303133;
    font-weight: 600;
  }

  .route-modes {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .route-mode-item {
      padding: 8px;
      border-radius: 4px;
      background: rgba(245, 247, 250, 0.85);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid transparent;

      &:hover {
        background: rgba(236, 245, 255, 0.9);
        transform: translateX(3px);
      }

      &.active {
        background: rgba(236, 245, 255, 0.9);
        border: 1px solid #409EFF;
        transform: translateX(3px);
      }

      .mode-header {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;

        i {
          font-size: 14px;
          color: #409EFF;
        }

        .mode-name {
          font-weight: 500;
          color: #303133;
          font-size: 12px;
        }
      }

      .mode-details {
        display: flex;
        justify-content: space-between;
        padding-left: 20px;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #606266;
          font-size: 11px;

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}

/* Add Banner styles */
.banner-section {
  position: relative;
  z-index: 1;
  margin: 100px 0;
  background: transparent;
}

/* Adjust content section styles to accommodate banner */
.content-section {
  padding-bottom: 0px; // Reserve space for banner
}

/* Add hint styles */
.select-cinema-hint {
  background: rgba(51, 51, 51, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  margin: 20px 0;
  text-align: center;
  backdrop-filter: blur(10px);

  .hint-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #ffffff;
    font-size: 16px;
    
    i {
      font-size: 24px;
      color: #409EFF;
    }
  }
}
</style>

