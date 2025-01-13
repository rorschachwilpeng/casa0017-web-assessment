<template>
  <section class="booking-section">
    <div class="content-wrapper">
      <div class="booking-banner">
        <div class="banner-bg">
          <img src="@/assets/back.png" alt="Movies Collage" />
        </div>
        <div class="booking-content">
          <div class="booking-text">
            <h2>Book your tickets now!</h2>
            <p>This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.</p>
          </div>
          <router-link to="/seats/index" class="book-ticket-btn">Book a Ticket</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BookingBanner'
}
</script>

<style scoped>
.booking-section {
  padding: 0;
  margin-top: 60px;
  width: 100%;
}

.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

.booking-banner {
  position: relative;
  width: 100%;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.banner-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.booking-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, 
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.booking-text {
  max-width: 70%;
}

.booking-text h2 {
  color: #FFFFFF;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 16px;
}

.booking-text p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.6;
}

.book-ticket-btn {
  background: #FF0000;
  color: #FFFFFF;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.book-ticket-btn:hover {
  background: #E60000;
}
</style>
