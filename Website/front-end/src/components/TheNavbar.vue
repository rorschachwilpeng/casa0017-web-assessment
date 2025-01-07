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
          <router-link to="/" class="nav-link active">Home</router-link>
          <router-link to="/movies" class="nav-link">Movies</router-link>
          <router-link to="/cinemas" class="nav-link">Cinemas</router-link>
          <router-link to="/booking" class="nav-link">Booking</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
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

.nav-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;         /* 从 13px 增加到 14px */
  font-weight: 500;
  padding: 6px 12px;       /* 增加内边距 */
  transition: all 0.3s ease;
  border-radius: 6px;      /* 添加圆角 */
}

/* 导航链接悬浮效果 */
.nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* 当前激活的导航链接 */
.nav-link.active {
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.1);  /* 浅灰色背景 */
  backdrop-filter: blur(4px);                   /* 轻微模糊效果 */
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