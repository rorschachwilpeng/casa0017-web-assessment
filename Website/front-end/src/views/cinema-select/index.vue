<template>
  <div class="app-container">
    <!-- 顶部电影信息 -->
    <div class="movie-header">
      <!-- 添加电影选择器 -->
      <div class="movie-selector">
        <span class="label">Select Movie:</span>
        <el-select 
          v-model="selectedMovieId" 
          placeholder="请选择电影" 
          @change="handleMovieChange"
          style="width: 300px;"
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

      <h2 class="movie-title" v-if="movieTitle">{{ movieTitle }}</h2>
      
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
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧影院列表 -->
      <div class="cinemas-list">
        <div v-for="cinema in sortedCinemas" :key="cinema.id" class="cinema-item" @click="selectCinema(cinema)">
          <h3>{{ cinema.name }}</h3>
          <div class="cinema-info">
            <span class="distance">Distance: {{ cinema.distance }}km</span>
            <span class="rating">Rating: {{ cinema.rating }}</span>
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
        <el-button type="primary">Closest route</el-button>
        <el-button type="success">Secure route</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import request from '@/utils/request'

// 修复 Leaflet 图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'CinemaSelect',
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
      userLocation: null,
      cinemas: [],
      loading: false
    }
  },
  async created() {
    await this.fetchMovies()
  },
  computed: {
    sortedCinemas() {
      if (!this.userLocation) {
        // 如果没有用户位置，按评分排序并返回前5个
        return [...this.cinemas]
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, 5);
      }

      // 如果有用户位置，先计算距离，然后根据筛选条件排序，最后返回前5个
      return [...this.cinemas]
        .map(cinema => ({
          ...cinema,
          distance: this.calculateDistance(
            this.userLocation.latitude,
            this.userLocation.longitude,
            cinema.latitude,
            cinema.longitude
          )
        }))
        .sort((a, b) => {
          if (this.selectedFilter === 'closest') {
            return parseFloat(a.distance) - parseFloat(b.distance);
          } else {
            return parseFloat(b.rating) - parseFloat(a.rating);
          }
        })
        .slice(0, 5); // 只返回前5个影院
    }
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
        const marker = L.marker([cinema.latitude, cinema.longitude])
          .bindPopup(`
            <h3>${cinema.name}</h3>
            <p>Rating: ${cinema.rating}</p>
          `)
          .addTo(this.map)
        
        this.cinemaMarkers.push(marker)

        // 添加点击事件
        marker.on('click', () => {
          this.selectCinema(cinema)
        })
      })
    },

    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.$message.error('Geolocation is not supported by your browser')
        return
      }

      this.$message({
        message: 'Getting your location...',
        type: 'info'
      })

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          this.userLocation = { latitude, longitude }

          // 更新或添加用户位置标记
          if (this.userMarker) {
            this.userMarker.setLatLng([latitude, longitude])
          } else {
            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: '<i class="el-icon-location"></i>',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })

            this.userMarker = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(this.map)
          }

          // 将地图中心移动到用户位置
          this.map.setView([latitude, longitude], 13)

          // 更新所有影院的距离
          this.updateCinemaDistances()

          this.$message({
            message: 'Location found!',
            type: 'success'
          })
        },
        error => {
          this.$message.error('Unable to get your location: ' + error.message)
        }
      )
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
            distance: '0'
          }))
          console.log('处理后的影院数据:', this.cinemas);
          
          if (this.map) {
            this.addCinemaMarkers()
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
.app-container {
  padding: 20px;
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
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
    
    &:hover {
      background: #555;
    }
  }
  
  .cinema-item {
    background: #fff;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    cursor: pointer;

    &:hover {
      background: #f5f7fa;
    }

    h3 {
      margin: 0 0 10px;
    }

    .cinema-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #666;

      .distance {
        font-weight: bold;
        color: #409EFF;
      }
    }

    .showtime-info {
      .times {
        display: flex;
        gap: 10px;
        margin-top: 5px;
        color: #409EFF;
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
}

:global(.user-location-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409EFF;
  border-radius: 50%;
  width: 30px !important;
  height: 30px !important;

  i {
    color: white;
    font-size: 18px;
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
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

  h2 {
    margin: 0 0 20px;
  }

  .cinema-images {
    margin-bottom: 20px;
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
  }

  .info-section {
    margin-bottom: 20px;

    .info-item {
      margin-bottom: 15px;

      label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
      }

      p {
        margin: 0;
        color: #666;
      }

      .comments {
        p {
          margin-bottom: 5px;
        }
      }
    }
  }

  .route-buttons {
    display: flex;
    gap: 15px;
  }
}
</style> 