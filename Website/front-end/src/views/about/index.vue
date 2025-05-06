<template>
  <div class="about-page bg-black">
    <TheNavbar />

    <!-- Main content container -->
    <div class="main-container mx-auto px-[100px]">
      <!-- Video section -->
      <section class="video-section py-20">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">Watch Our Video</h2>
        <div class="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/DSnffi7dldU"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full rounded-lg"
          />
        </div>
      </section>

      <!-- Booking banner section -->
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
      // Component data will be added here
    }
  }
}
</script>

<style scoped>
/* Main page styles */
.about-page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
}

/* Container layout */
.main-container {
  padding: 80px 80px;
  margin: 0 auto;
}

/* Video container styles */
.video-section {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

/* 16:9 aspect ratio container */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

/* Video iframe styles */
.aspect-w-16 iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>
