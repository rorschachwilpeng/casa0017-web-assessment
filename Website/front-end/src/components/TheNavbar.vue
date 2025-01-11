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
          <router-link to="/home/index" class="nav-item">Home</router-link>
          <router-link to="/movie-list/index" class="nav-item">Movies</router-link>
          <router-link to="/cinema-select/index" class="nav-item">Cinemas</router-link>
          <router-link to="/seats" class="nav-item">Booking</router-link>
          <a href="https://github.com/rorschachwilpeng/casa0017-web-assessment" 
             target="_blank" 
             class="nav-item">About</a>
        </div>
      </div>
      <div class="nav-icons">
        <button class="icon-btn">
          
          <i class="fas fa-search"></i>
        </button>
        <button class="icon-btn">
          <i class="fas fa-user"></i>
        </button>
      </div>
    </nav>

</template>

<script>
export default {
  name: 'TheNavbar',
  data() {
    return {
      currentPath: ''
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
</style>