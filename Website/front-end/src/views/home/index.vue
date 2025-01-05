<template>
  <div class="home">
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

    <!-- 新增英雄区域（Hero Section）-->
    <section class="hero-section">
      <!-- 底层电影海报墙 -->
      <div class="movie-wall">
        <div class="movie-track">
          <!-- 第一组海报网格 -->
          <div class="movie-grid">
            <div v-for="row in 4" :key="`row1-${row}`" class="poster-row">
              <img v-for="col in 6" 
                   :key="`first-${row}-${col}`" 
                   :src="`/images/posters/movie${((row-1)*6 + col) % 20}.jpg`" 
                   :alt="`Movie ${((row-1)*6 + col) % 20}`" />
            </div>
          </div>
          <!-- 第二组海报网格 -->
          <div class="movie-grid">
            <div v-for="row in 4" :key="`row2-${row}`" class="poster-row">
              <img v-for="col in 6" 
                   :key="`second-${row}-${col}`" 
                   :src="`/images/posters/movie${((row-1)*6 + col) % 20}.jpg`" 
                   :alt="`Movie ${((row-1)*6 + col) % 20}`" />
            </div>
          </div>
          <!-- 添加第三组海报网格作为缓冲 -->
          <div class="movie-grid">
            <div v-for="row in 4" :key="`row3-${row}`" class="poster-row">
              <img v-for="col in 6" 
                   :key="`third-${row}-${col}`" 
                   :src="`/images/posters/movie${((row-1)*6 + col) % 20}.jpg`" 
                   :alt="`Movie ${((row-1)*6 + col) % 20}`" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 上层文字内容 -->
      <div class="hero-content">
        <h1>The Best Cinema Experience for You</h1>
        <p>CINEKNIGHT is dedicated to providing you with an unparalleled cinema experience.</p>
        <button class="cta-button">Find Cinema</button>
      </div>
    </section>

    <!-- 新增内容板块 -->
    <section class="content-section">
      <!-- 电影分类模块 -->
      <div class="module-section category-module">
        <div class="section-header">
          <h2>Explore wide variety of categories</h2>
          <div class="header-controls">
            <div class="controls-wrapper">
              <div class="slider-controls">
                <div class="dark-box" @click="prevPage" :class="{ disabled: currentPage === 0 }">
                  <span class="nav-arrow">&#8592;</span>
                </div>
                <div class="page-indicator">
                  <span class="indicator" :class="{ active: currentPage === 0 }"></span>
                  <span class="indicator" :class="{ active: currentPage === 1 }"></span>
                </div>
                <div class="dark-box" @click="nextPage" :class="{ disabled: currentPage === 1 }">
                  <span class="nav-arrow">&#8594;</span>
                </div>
              </div>
            </div>
            <div class="view-all-wrapper">
              <a href="#" class="view-all">View All</a>
            </div>
          </div>
        </div>

        <div class="categories-container">
          <transition-group name="slide">
            <!-- 第一页 -->
            <div v-show="currentPage === 0" key="page1" class="categories-grid">
              <!-- Action -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/action/action1.jpg" alt="Action">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/action/action2.jpg" alt="Action">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/action/action3.jpg" alt="Action">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/action/action4.jpg" alt="Action">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Action</h3>
                </div>
              </div>

              <!-- Adventure -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/adventure/adventure1.jpg" alt="Adventure">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/adventure/adventure2.jpg" alt="Adventure">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/adventure/adventure3.jpg" alt="Adventure">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/adventure/adventure4.jpg" alt="Adventure">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Adventure</h3>
                </div>
              </div>

              <!-- Comedy -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/comedy/comedy1.jpg" alt="Comedy">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/comedy/comedy2.jpg" alt="Comedy">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/comedy/comedy3.jpg" alt="Comedy">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/comedy/comedy4.jpg" alt="Comedy">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Comedy</h3>
                </div>
              </div>

              <!-- Drama -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/drama/drama1.jpg" alt="Drama">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/drama/drama2.jpg" alt="Drama">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/drama/drama3.jpg" alt="Drama">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/drama/drama4.jpg" alt="Drama">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Drama</h3>
                </div>
              </div>

              <!-- Horror -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/horror/horror1.jpg" alt="Horror">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/horror/horror2.jpg" alt="Horror">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/horror/horror3.jpg" alt="Horror">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/horror/horror4.jpg" alt="Horror">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Horror</h3>
                </div>
              </div>
            </div>

            <!-- 第二页 -->
            <div v-show="currentPage === 1" key="page2" class="categories-grid">
              <!-- Animation -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/animation/animation1.jpg" alt="Animation">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/animation/animation2.jpg" alt="Animation">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/animation/animation3.jpg" alt="Animation">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/animation/animation4.jpg" alt="Animation">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Animation</h3>
                </div>
              </div>

              <!-- Fantasy -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/fantasy/fantasy1.jpg" alt="Fantasy">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/fantasy/fantasy2.jpg" alt="Fantasy">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/fantasy/fantasy3.jpg" alt="Fantasy">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/fantasy/fantasy4.jpg" alt="Fantasy">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Fantasy</h3>
                </div>
              </div>

              <!-- Romance -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/romance/romance1.jpg" alt="Romance">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/romance/romance2.jpg" alt="Romance">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/romance/romance3.jpg" alt="Romance">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/romance/romance4.jpg" alt="Romance">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Romance</h3>
                </div>
              </div>

              <!-- Sci-Fi -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/scifi/scifi1.jpg" alt="Sci-Fi">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/scifi/scifi2.jpg" alt="Sci-Fi">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/scifi/scifi3.jpg" alt="Sci-Fi">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/scifi/scifi4.jpg" alt="Sci-Fi">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Sci-Fi</h3>
                </div>
              </div>

              <!-- Thriller -->
              <div class="category-card">
                <div class="category-images">
                  <div class="image-wrapper">
                    <img src="@/assets/categories/thriller/thriller1.jpg" alt="Thriller">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/thriller/thriller2.jpg" alt="Thriller">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/thriller/thriller3.jpg" alt="Thriller">
                  </div>
                  <div class="image-wrapper">
                    <img src="@/assets/categories/thriller/thriller4.jpg" alt="Thriller">
                  </div>
                </div>
                <div class="category-info">
                  <h3 class="category-name">Thriller</h3>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- 影院推荐模块 -->
      <div class="module-section cinema-module">
        <div class="section-header">
          <h2>Cinema Recommendations</h2>
          <div class="header-controls">
            <div class="slider-controls">
              <button class="control-btn prev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="control-btn next">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <a href="#" class="view-all">View All</a>
          </div>
        </div>
        <div class="cinema-cards">
          <div class="cinema-card">
            <img src="@/assets/cinemas/cinema1.jpg" alt="Vue Cinema">
            <div class="cinema-info">
              <h3>Vue Cinema - Westfield Stratford</h3>
              <p>A modern cineplex with state-of-the-art screens</p>
              <div class="rating">
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <button class="details-btn">View Property Details</button>
              </div>
            </div>
          </div>
          <!-- 其他影院卡片 -->
        </div>
      </div>

      <!-- 活动事项模块 -->
      <div class="module-section events-module">
        <div class="section-header">
          <h2>Events</h2>
          <!-- ... 其他内容 ... -->
        </div>
        <!-- 活动内容 -->
      </div>
    </section>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon'  // 导入 SvgIcon 组件
</script>

<script>
export default {
  name: 'Home',
  data() {
    return {
      currentPage: 0
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < 1) {
        this.currentPage++
      }
    }
  }
}
</script>

<style scoped>
/* 全局背景样式 */
.home {
  width: 100%;
  min-height: 100vh;
  background-color: #0A0A0A;
  color: #ffffff;
}

/* 导航栏样式 */
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

/* 确保主要内容区域不被固定导航栏遮挡 */
main {
  padding-top: 80px;
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 电影海报墙样式 */
.movie-wall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  overflow: hidden;
}

.movie-track {
  display: flex;
  width: fit-content;
  animation: scrollWall 90s linear infinite;
  position: relative;
  left: 0;
  margin: 0;
  padding: 0;
}

.movie-grid:hover ~ .movie-track,
.movie-grid:hover + .movie-track,
.movie-track:hover {
  animation-play-state: paused;
}

.movie-wall:hover .movie-track {
  animation-play-state: paused;
}

.movie-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  margin: 0;
  flex-shrink: 0;
}

.poster-row {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
}

.movie-grid img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  pointer-events: auto;
}

.movie-grid img:hover {
  opacity: 0.8;
}

/* 上层内容样式 */
.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 20px;
  max-width: 800px;
  transform: translateY(200px);
}

.hero-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
  font-size: 18px;
  margin-bottom: 32px;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.cta-button {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background-color: #ff0000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #cc0000;
}

/* 海报墙滚动动画 */
@keyframes scrollWall {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-66.666% - 2px));
  }
}

/* 移除额外的遮罩渐变 */
.hero-section::after {
  display: none;
}

/* 响应式调整 */
@media (max-width: 1440px) {
  .movie-grid img {
    width: 130px;
    height: 130px;
  }
  .movie-grid, .poster-row {
    gap: 14px;
  }
}

@media (max-width: 1024px) {
  .movie-grid img {
    width: 110px;
    height: 110px;
  }
  .movie-grid, .poster-row {
    gap: 12px;
  }
}

/* 确保两组海报完全一致 */
.movie-grid:first-child {
  margin-right: 0;
}

.movie-grid:last-child {
  margin-left: 0;
}

/* 为最后一行海报添加渐变效果 */
.poster-row:last-child img {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 50%,    /* 海报一半高度开始渐变 */
    rgba(0, 0, 0, 0) 100%    /* 底部完全透明 */
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

/* 内容区域样式 */
.content-section {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(26, 26, 26, 0.8) 5%,   /* 快速渐变到深灰色 */
    rgba(26, 26, 26, 1) 10%,    /* 完全不透明 */
    rgba(26, 26, 26, 1) 100%    /* 保持不透明 */
  );
  padding: 60px 120px;
  margin-top: -200px;  /* 向上移动整个模块 */
  position: relative;
  z-index: 2;
}

/* 分类部分上移 */
.category-section {
  margin-top: 40px;  /* 给顶部渐变留出空间 */
}

/* 确保内容正确显示 */
.section-header {
  position: relative;
  z-index: 2;
}

/* 底部图片渐变保持不变 */
.image-wrapper.bottom::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 85%,
    rgba(0, 0, 0, 1) 100%
  );
  pointer-events: none;
  border-radius: 12px;
}

/* 通用标题样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-header h2 {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 600;
}

/* 控制按钮样式 */
.header-controls {
  display: flex;
  gap: 12px;  /* 减小间距 */
  align-items: center;
}

.controls-wrapper {
  background: #1A1A1A;
  border-radius: 12px;
  padding: 4px;
  height: 52px;  /* 固定高度 */
  display: flex;
  align-items: center;
}

.slider-controls {
  background: #2A2A2A;
  border-radius: 8px;
  padding: 4px;  /* 减小内边距 */
  display: flex;
  align-items: center;
  gap: 16px;  /* 调整间距 */
  height: 52px;
  min-width: 200px;
  justify-content: space-between;  /* 两端对齐 */
}

.dark-box {
  width: 40px;
  height: 40px;
  background: #1A1A1A;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;     /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.arrow-icon {
  font-size: 16px;        /* 调整箭头大小 */
  color: #FFFFFF;         /* 箭头颜色为白色 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-box:hover {
  background: #252525;
}

.page-indicator {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.control-btn-wrapper {
  width: 44px;
  height: 44px;
  background: #1A1A1A;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.control-btn {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #FFFFFF;
}

.page-indicator {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.indicator {
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
}

.indicator.active {
  background: #FF0000;
}

.view-all-wrapper {
  background: #1A1A1A;
  border-radius: 12px;
  padding: 4px;
  height: 52px;  /* 与箭头框保持相同高度 */
  display: flex;
  align-items: center;
}

.view-all {
  display: flex;
  align-items: center;
  height: 44px;  /* 与内层框保持相同高度 */
  padding: 0 16px;
  background: #2A2A2A;
  border-radius: 8px;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease;
  white-space: nowrap;  /* 防止文字换行 */
}

.view-all:hover {
  background: #333333;
}

/* 分类网格样式优化 */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  width: 100%;
}

/* 分类卡片样式优化 */
.category-card {
  background: #2A2A2A;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  padding: 16px;
}

.category-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  background: transparent;
  margin-bottom: 16px;
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

/* 底部图片渐变效果 */
.image-wrapper.bottom::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

/* 确保渐变效果在悬浮时保持 */
.category-card:hover .image-wrapper.bottom::after {
  opacity: 1;
}

/* 图片容器基础样式 */
.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  padding-top: 100%;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.category-info {
  display: flex;
  align-items: center;
  padding: 0;
}

.category-name {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
}

/* 右下角箭头样式 */
.arrow-icon {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.arrow-icon i {
  color: #FFFFFF;
  font-size: 14px;
  transition: transform 0.3s ease;
}

/* 悬浮效果 */
.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.category-card:hover .arrow-icon {
  background: rgba(255, 255, 255, 0.2);
}

.category-card:hover .arrow-icon i {
  transform: translateX(2px);
}

/* 确保图片容器正确显示 */
.image-wrapper {
  aspect-ratio: 1;
  background: #1A1A1A;
}

/* 影院卡片样式 */
.cinema-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.cinema-card {
  background: #2A2A2A;
  border-radius: 12px;
  overflow: hidden;
}

.cinema-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.cinema-info {
  padding: 20px;
}

/* 活动卡片样式 */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.event-card {
  background: #2A2A2A;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.event-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 16px;
}

.event-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* SVG 图标样式 */
.control-btn .svg-icon {
  width: 20px;
  height: 20px;
  color: #FFFFFF;
}

/* ... 其他样式保持不变 ... */

.control-btn-wrapper {
  width: 40px;
  height: 40px;
  background: #1A1A1A;
  border-radius: 4px;  /* 改为小圆角方形 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

.control-btn {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
  border-radius: 4px;  /* 匹配外框的圆角 */
}

.nav-arrow {
  color: #FFFFFF;
  font-size: 18px;  /* 调整箭头大小 */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;  /* 防止文本被选中 */
}

.dark-box {
  width: 40px;
  height: 40px;
  background: #1A1A1A;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dark-box:hover {
  background: #252525;
}

h2 {
  margin: 0;
  padding: 0;
}

.content-section {
  padding-top: 120px;  /* 增加与海报墙的距离 */
  padding-bottom: 80px;  /* 底部间距 */
}

.section-header {
  margin-bottom: 40px;  /* 标题与内容的间距 */
}

h2 {
  margin: 0;
  padding: 0;
  font-size: 28px;  /* 可选：调整标题大小 */
  font-weight: 600;
}

/* 模块之间的间距 */
.section + .section {
  margin-top: 80px;  /* 增加模块之间的间距 */
}

/* 模块基础样式 */
.module-section {
  margin-bottom: 100px;  /* 增加模块之间的间距 */
}

/* 最后一个模块不需要底部间距 */
.module-section:last-child {
  margin-bottom: 0;
}

/* 添加滑动动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.categories-container {
  position: relative;
  min-height: 500px; /* 设置一个最小高度以确保容器高度足够 */
}

.categories-grid {
  position: absolute;
  width: 100%;
}
</style>