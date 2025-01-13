<template>
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="CINEKNIGHT" />
      </div>
      <div class="nav-links-container">
        <!-- 添加深灰色背景 -->
        <div class="nav-background"></div>
        <div class="nav-links">
<<<<<<< HEAD
          <router-link to="/home/index" class="nav-item">Home</router-link>
          <router-link to="/movie-list/index" class="nav-item">Movies</router-link>
          <router-link to="/cinema-select/index" class="nav-item">Cinemas</router-link>
          <router-link to="/seats" class="nav-item">Booking</router-link>
          <a href="https://github.com/rorschachwilpeng/casa0017-web-assessment" 
             target="_blank" 
             class="nav-item">About</a>
=======
          <router-link to="/home/index" class="nav-link" :class="{ active: currentPath === '/home/index' }">Home</router-link>
          <router-link to="/movie-list/index" class="nav-link" :class="{ active: currentPath === '/movie-list/index' }">Movies</router-link>
          <router-link to="/cinema-select/index" class="nav-link" :class="{ active: currentPath === '/cinema-select/index' }">Cinemas</router-link>
          <router-link to="/seats/index" class="nav-link" :class="{ active: currentPath === '/seats/index' }">Booking</router-link>
          <router-link to="/about/index" class="nav-link" :class="{ active: currentPath === '/about/index' }">About</router-link>
>>>>>>> update-movie-details-ui
        </div>
      </div>
      <div class="nav-icons">
        <div class="location-container">
          <button class="icon-btn" @click="getLocation">
            <svg-icon icon-class="Map Point Wave" />
          </button>
          <div v-if="userLocation" class="location-tooltip">
            <p>Current Location:</p>
            <p>Latitude: {{ userLocation.latitude.toFixed(4) }}°</p>
            <p>Longitude: {{ userLocation.longitude.toFixed(4) }}°</p>
          </div>
        </div>
        <a href="https://github.com/rorschachwilpeng/casa0017-web-assessment" 
           target="_blank" 
           class="icon-btn">
          <svg-icon icon-class="Letter" />
        </a>
      </div>
    </nav>

</template>

<script>
export default {
  name: 'TheNavbar',
  data() {
    return {
      currentPath: '',
      userLocation: null
    }
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            // 这里可以添加获取位置成功后的操作
            console.log('位置信息：', this.userLocation);
            // 可以触发一个事件通知父组件
            this.$emit('location-updated', this.userLocation);
          },
          error => {
            console.error('获取位置失败：', error.message);
            // 可以添加错误提示
            alert('无法获取您的位置信息，请检查位置权限设置');
          }
        );
      } else {
        alert('您的浏览器不支持地理位置功能');
      }
    }
  },
  created() {
    this.currentPath = this.$route.path
  },
  watch: {
    '$route'(to) {
      this.currentPath = to.path
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 124px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9) 0%,      /* 顶部近乎不透明 */
    rgba(0, 0, 0, 0.9) 70%,     /* 保持不透明到70% */
    rgba(0, 0, 0, 0) 100%       /* 底部突然变为透明 */
  );
  z-index: 1000;
}

/* Logo样式 */
.logo img {
  height: 36px;
}

/* 导航链接容器 */
.nav-links-container {
  position: relative;
  padding: 4px 0;
}

/* 深灰色圆角矩形背景 */
.nav-background {
  position: absolute;
  top: -4px;
  left: -10px;
  right: -10px;
  bottom: -4px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(153, 153, 153, 0.5);
  border-radius: 8px;
  z-index: 1;
}

/* 导航链接 */
.nav-links {
  position: relative;
  display: flex;
  gap: 24px;
  z-index: 2;
  padding: 4px 0;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 激活状态的样式 */
.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 图标按钮样式 */
.nav-icons {
  display: flex;
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.3s ease;
}

.icon-btn:hover {
  color: #ff0000;
}

@media screen and (max-width: 1200px) {
  .navbar {
    padding: 20px 40px;
  }
}

@media screen and (max-width: 768px) {
  .nav-links {
    display: none;
  }
}

.location-container {
  position: relative;
}

.location-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(153, 153, 153, 0.5);
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  min-width: 200px;
  display: none;
  color: white;
  font-size: 14px;
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.location-tooltip p {
  margin: 5px 0;
}

.location-container:hover .location-tooltip {
  display: block;
}

/* 添加小三角形指示器 */
.location-tooltip::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 8px 8px 8px;
  border-style: solid;
  border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
}
</style>