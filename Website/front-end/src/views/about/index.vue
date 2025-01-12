<template>
  <div class="about-page bg-black">
    <TheNavbar />
    
    <!-- 主要内容容器 -->
    <div class="main-container mx-auto px-[100px]">
      <!-- 视频部分 -->
      <section class="video-section py-20">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">观看我们的视频</h2>
        <div class="aspect-w-16 aspect-h-9">
          <iframe 
            src="https://www.youtube.com/embed/DSnffi7dldU" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="w-full h-full rounded-lg"
          ></iframe>
        </div>
      </section>

      <!-- 预订横幅 -->
      <section class="booking-banner-section py-20">
        <BookingBanner />
      </section>
    </div>

    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import BookingBanner from '@/components/BookingBanner.vue'

export default {
  name: 'AboutPage',
  components: {
    TheNavbar,
    TheFooter,
    BookingBanner
  },
  data() {
    return {
      // 删除 teamMembers 数组
    }
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
}

.main-container {
  padding: 80px 80px;
  margin: 0 auto;
}

/* 视频容器样式 */
.video-section {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 比例 */
}

.aspect-w-16 iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>
