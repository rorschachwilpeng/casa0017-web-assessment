<template>
  <div class="home">
    <!-- 导航栏 -->
    <TheNavbar />
    
    <div class="content-section">
      <!-- 原有的内容 -->
      <div class="app-container">
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
                <el-radio-button label="tomorrow">tomorrow</el-radio-button>
                <el-button size="small" icon="el-icon-date">select</el-button>
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

        <!-- 选中的影院详情 -->
        <div v-if="selectedCinema" class="cinema-details">
          <h2>{{ selectedCinema.name }}</h2>
          
          <!-- 影院图片 -->
          <div class="cinema-images">
            <img :src="selectedCinema.image" :alt="selectedCinema.name">
          </div>

          <!-- 影院信息 -->
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

          <!-- 路线按钮 -->
          <div class="route-buttons">
            <el-button type="primary" @click="showRoute">Route</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner和页脚 -->
    <BookingBanner />
    <TheFooter />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import request from '@/utils/request'
import axios from 'axios'
import TheNavbar from '@/components/TheNavbar.vue'
import BookingBanner from '@/components/BookingBanner.vue'
import TheFooter from '@/components/TheFooter.vue'

// 修复 Leaflet 图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'CinemaSelect',
  components: {
    TheNavbar,
    BookingBanner,
    TheFooter
  },
  data() {
    return {
      moviesList: [], // 电影列表
      selectedMovieId: null, // 选中的电影ID
      movieTitle: '',
      selectedTime: 'today',
      selectedFilter: 'closest',
      selectedCinema: null,
      map: null,
      userMarker: null,
      cinemaMarkers: [],
      routePolylines: [], // 添加路线折线数组
      userLocation: null,
      cinemas: [],
      loading: false,
      routeInfo: null, // 添加路线信息
      selectedTransportMode: 'driving' // 默认选择驾驶模式
    }
  },
  computed: {
    sortedCinemas() {
      if (!this.cinemas.length) return [];

      let sorted = [...this.cinemas];

      if (this.selectedFilter === 'safest') {
        // 按安全分数排序
        sorted = sorted.sort((a, b) => (b.safety_score || 0) - (a.safety_score || 0));
      } else if (this.selectedFilter === 'closest' && this.userLocation) {
        // 按距离排序
        sorted = sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      } else {
        // 按评分排序
        sorted = sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      }

      return sorted.slice(0, 5); // 只返回前5个影院
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
      // 初始化地图，以伦敦为中心
      this.map = L.map('map').setView([51.5074, -0.1278], 13)
      
      // 添加地图图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)

      // 添加影院标记
      this.addCinemaMarkers()
    },

    addCinemaMarkers() {
      // 清除现有标记
      this.cinemaMarkers.forEach(marker => marker.remove())
      this.cinemaMarkers = []

      // 为每个影院添加标记
      this.cinemas.forEach(cinema => {
        // 创建自定义图标
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
        
        // 如果有安全分数，添加圆形区域表示安全等级
        if (cinema.safety_score !== undefined) {
          const circle = L.circle([cinema.latitude, cinema.longitude], {
            color: safetyColor,
            fillColor: safetyColor,
            fillOpacity: 0.1,
            radius: 500 // 500米半径
          }).addTo(this.map)
          
          this.cinemaMarkers.push(circle)
        }

        this.cinemaMarkers.push(marker)

        // 添加点击事件
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

    // 获取电影列表
    async fetchMovies() {
      console.log('=== 开始获取电影列表 ===');
      try {
        const response = await request({
          url: '/api/movies',
          method: 'get'
        })
        console.log('电影列表响应:', response);
        
        if (response && response.data) {
          this.moviesList = response.data
          console.log('获取到的电影列表:', this.moviesList);
          
          // 如果有电影数据，默认选择第一个
          if (this.moviesList.length > 0) {
            this.selectedMovieId = this.moviesList[0].id
            console.log('默认选择的电影ID:', this.selectedMovieId);
            await this.handleMovieChange(this.selectedMovieId)
          } else {
            console.log('没有可用的电影数据');
          }
        }
      } catch (error) {
        console.error('获取电影列表失败:', error)
        this.$message.error('Failed to load movies list')
      }
    },

    // 处理电影选择变化
    async handleMovieChange(movieId) {
      if (!movieId) return
      
      console.log('=== 电影选择变化 ===');
      console.log('选中的电影ID:', movieId);
      
      this.movieTitle = this.moviesList.find(m => m.id === movieId)?.name || ''
      console.log('电影标题:', this.movieTitle);
      
      await this.fetchCinemas(movieId)
    },

    // 获取影院信息
    async fetchCinemas(movieId) {
      console.log('=== 开始获取影院信息 ===');
      console.log('请求的电影ID:', movieId);
      
      this.loading = true
      try {
        const response = await request({
          url: `/api/cinemas/movie/${movieId}`,
          method: 'get'
        })
        console.log('影院数据响应:', response);
        
        if (response && response.data) {
          this.cinemas = response.data.map(cinema => ({
            ...cinema,
            distance: '0',
            screenings: cinema.screening_times ? cinema.screening_times.split(',') : []
          }))
          console.log('处理后的影院数据:', this.cinemas);
          
          // 确保地图已初始化
          if (!this.map) {
            this.initMap()
          }
          
          // 添加或更新影院标记
          this.addCinemaMarkers()
          
          // 如果有用户位置，更新距离
          if (this.userLocation) {
            this.updateCinemaDistances()
          }
          
          // 调整地图视图以显示所有影院
          if (this.cinemas.length > 0) {
            const bounds = L.latLngBounds(this.cinemas.map(cinema => [cinema.latitude, cinema.longitude]))
            this.map.fitBounds(bounds, { padding: [50, 50] })
          }
        }
      } catch (error) {
        console.error('获取影院数据失败:', error)
        this.$message.error('Failed to load cinema data')
      } finally {
        this.loading = false
      }
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // 地球半径，单位公里
      const dLat = this.deg2rad(lat2 - lat1)
      const dLon = this.deg2rad(lon2 - lon1)
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c // 距离，单位公里
      return distance.toFixed(1) // 保留一位小数
    },

    deg2rad(deg) {
      return deg * (Math.PI/180)
    },

    getSafetyColor(score) {
      if (score >= 80) return 'rgba(76, 175, 80, 0.9)' // 绿色 - 安全
      if (score >= 50) return 'rgba(255, 193, 7, 0.9)' // 黄色 - 中等
      return 'rgba(244, 67, 54, 0.9)' // 红色 - 需要注意
    },

    // 修改显示路线方法
    async showRoute() {
      if (!this.userLocation || !this.selectedCinema) {
        this.$message.warning('Please get your location first');
        return;
      }
      
      try {
        // 准备请求数据
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

        // 发送路线计算请求
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

    // 在地图上绘制路线
    drawRouteOnMap(routeInfo) {
      console.log('[Route] Starting to draw route with data:', JSON.stringify(routeInfo, null, 2));
      
      // 清除现有路线
      if (this.routePolylines) {
        this.routePolylines.forEach(line => {
          if (line && typeof line.remove === 'function') {
            line.remove();
          }
        });
      }
      this.routePolylines = [];

      // 获取选中的交通方式路线
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

      // 验证路径数据
      if (!Array.isArray(route.path)) {
        console.error('[Route] Path is not an array:', route.path);
        return;
      }

      if (route.path.length === 0) {
        console.error('[Route] Path array is empty');
        return;
      }

      // 验证坐标格式
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
        // 统一使用蓝色
        const routeColor = '#409EFF';

        // 创建路线样式
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

        // 绘制主路线
        const polyline = L.polyline(route.path, routeStyle).addTo(this.map);
        this.routePolylines.push(polyline);

        // 调整地图视图以显示整个路线
        this.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

        // 添加起点和终点标记
        const startPoint = route.path[0];
        const endPoint = route.path[route.path.length - 1];

        // 创建起点标记
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

        // 创建终点标记
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

        // 添加起点和终点标记
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
      this.selectedTransportMode = mode; // 先更新选中的交通方式
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
}

.content-section {
  padding: 120px 120px;
}

/* 全局样式 */
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #0A0A0A;
  color: #ffffff;
  padding: 120px 124px 60px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(26, 26, 26, 0.8) 5%,
    rgba(26, 26, 26, 1) 10%,
    rgba(26, 26, 26, 1) 100%
  );
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
    margin-top: 10px;

    .label {
      margin-right: 10px;
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
    margin-bottom: 20px;
    
    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
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

/* Element UI 深色主题样式覆盖 */
:deep(.el-select) {
  .el-input__inner {
    background: rgba(26, 26, 26, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border-radius: 4px;
    height: 40px;
    
    &:hover, &:focus {
      border-color: #409EFF;
    }
  }
  
  .el-select-dropdown {
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    
    .el-select-dropdown__item {
      color: #ffffff;
      
      &:hover, &.selected {
        background: rgba(64, 158, 255, 0.2);
      }
      
      &.selected {
        color: #409EFF;
      }
    }
  }
}

:deep(.el-radio-group) {
  .el-radio-button__inner {
    background: rgba(26, 26, 26, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    
    &:hover {
      color: #409EFF;
    }
  }
  
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #409EFF;
    border-color: #409EFF;
    box-shadow: -1px 0 0 0 #409EFF;
    color: #ffffff;
  }
}

:deep(.el-button) {
  &.el-button--default {
    background: rgba(26, 26, 26, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    height: 32px;
    padding: 0 15px;
    
    &:hover, &:focus {
      background: rgba(64, 158, 255, 0.1);
      border-color: #409EFF;
      color: #409EFF;
    }
  }
  
  &.el-button--primary {
    background: #409EFF;
    border-color: #409EFF;
    
    &:hover, &:focus {
      background: #66b1ff;
      border-color: #66b1ff;
    }
  }

  &.location-button {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1000;
    border-radius: 20px;
    padding: 8px 16px;
  }
}
</style> 