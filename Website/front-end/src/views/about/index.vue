<template>
  <div class="about-page bg-black">
    <TheNavbar />
    <BookingBanner />
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
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}
</style>
