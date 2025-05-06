<template>
  <div class="home">
    <!-- Navigation bar -->
    <TheNavbar />

    <!-- Hero section -->
    <section class="hero-section">
      <!-- Movie poster wall background -->
      <div class="movie-wall">
        <div class="movie-track">
          <!-- First grid of posters -->
          <div class="movie-grid">
            <div v-for="row in 4" :key="`row1-${row}`" class="poster-row">
              <img
                v-for="col in 6"
                :key="`first-${row}-${col}`"
                :src="`/images/posters/movie${((row-1)*6 + col) % 20}.jpg`"
                :alt="`Movie ${((row-1)*6 + col) % 20}`"
              >
            </div>
          </div>
          <!-- Second grid of posters -->
          <div class="movie-grid">
            <div v-for="row in 4" :key="`row2-${row}`" class="poster-row">
              <img
                v-for="col in 6"
                :key="`second-${row}-${col}`"
                :src="`/images/posters/movie${((row-1)*6 + col) % 20}.jpg`"
                :alt="`Movie ${((row-1)*6 + col) % 20}`"
              >
            </div>
          </div>
          <!-- Third grid of posters (for infinite scroll) -->
          <div class="movie-grid">
            <div v-for="row in 4" :key="`row3-${row}`" class="poster-row">
              <img
                v-for="col in 6"
                :key="`third-${row}-${col}`"
                :src="`/images/posters/movie${((row-1)*6 + col) % 20}.jpg`"
                :alt="`Movie ${((row-1)*6 + col) % 20}`"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Upper layer text content -->
      <div class="hero-content">
        <h1>The Best Cinema Experience for You</h1>
        <p>CINEKNIGHT is dedicated to providing you with an unparalleled cinema experience.</p>
        <button class="find-cinema-btn" @click="goToCinemaSelect">Find Cinema</button>
      </div>
    </section>

    <!-- New content section -->
    <section class="content-section">
      <!-- Movie category module -->
      <div class="module-section category-module">
        <div class="section-header">
          <h2>Explore wide variety of categories</h2>
          <div class="header-controls">
            <div class="view-all-wrapper">
              <a class="view-all" @click="goToMovieList">View All</a>
            </div>
          </div>
        </div>

        <div class="categories-container">
          <div class="categories-grid">
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
          </div>
        </div>
      </div>

      <!-- Cinema recommendations module -->
      <div class="module-section cinema-module">
        <div class="section-header">
          <h2>Cinema Recommendations</h2>
          <div class="header-controls">
            <div class="controls-wrapper">
              <div class="slider-controls">
                <div class="dark-box" :class="{ disabled: currentCinemaPage === 0 }" @click="prevCinemaPage">
                  <span class="nav-arrow">&#8592;</span>
                </div>
                <div class="page-indicator">
                  <span class="indicator" :class="{ active: currentCinemaPage === 0 }" />
                  <span class="indicator" :class="{ active: currentCinemaPage === 1 }" />
                </div>
                <div class="dark-box" :class="{ disabled: currentCinemaPage === 1 }" @click="nextCinemaPage">
                  <span class="nav-arrow">&#8594;</span>
                </div>
              </div>
            </div>
            <div class="view-all-wrapper">
              <a class="view-all" @click="goToCinemaSelect">View All</a>
            </div>
          </div>
        </div>

        <div class="cinemas-container">
          <transition-group name="slide">
            <!-- First page of cinemas -->
            <div v-show="currentCinemaPage === 0" key="cinema-page1" class="cinema-cards">
              <div class="cinema-card">
                <img src="@/assets/cinemas/cinema1.jpg" alt="Vue Cinema">
                <div class="cinema-info">
                  <h3>Vue Cinema - Westfield Stratford</h3>
                  <p>A modern cineplex with state-of-the-art screens</p>
                  <div class="rating">
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <button class="details-btn">View Details</button>
                  </div>
                </div>
              </div>

              <div class="cinema-card">
                <img src="@/assets/cinemas/cinema2.jpg" alt="Odeon Luxe">
                <div class="cinema-info">
                  <h3>Odeon Luxe - Leicester Square</h3>
                  <p>Luxury cinema experience in the heart of London</p>
                  <div class="rating">
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <button class="details-btn">View Details</button>
                  </div>
                </div>
              </div>

              <div class="cinema-card">
                <img src="@/assets/cinemas/cinema3.jpg" alt="Picturehouse">
                <div class="cinema-info">
                  <h3>Picturehouse Central</h3>
                  <p>Arthouse and mainstream films in stylish surroundings</p>
                  <div class="rating">
                    <div class="stars">⭐⭐⭐⭐½</div>
                    <button class="details-btn">View Details</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Second page of cinemas -->
            <div v-show="currentCinemaPage === 1" key="cinema-page2" class="cinema-cards">
              <div class="cinema-card">
                <img src="@/assets/cinemas/cinema4.jpg" alt="Everyman">
                <div class="cinema-info">
                  <h3>Everyman Screen on the Green</h3>
                  <p>Boutique cinema with sofa seating and bar service</p>
                  <div class="rating">
                    <div class="stars">⭐⭐⭐⭐½</div>
                    <button class="details-btn">View Details</button>
                  </div>
                </div>
              </div>

              <div class="cinema-card">
                <img src="@/assets/cinemas/cinema5.jpg" alt="Curzon">
                <div class="cinema-info">
                  <h3>Curzon Soho</h3>
                  <p>Independent cinema showing art house films</p>
                  <div class="rating">
                    <div class="stars">⭐⭐⭐⭐</div>
                    <button class="details-btn">View Details</button>
                  </div>
                </div>
              </div>

              <div class="cinema-card">
                <img src="@/assets/cinemas/cinema6.jpg" alt="BFI IMAX">
                <div class="cinema-info">
                  <h3>BFI IMAX - Waterloo</h3>
                  <p>The UK's largest cinema screen</p>
                  <div class="rating">
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <button class="details-btn">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Events & Promotional Offers section -->
      <section class="events-section">
        <h2>Events & Promotional Offers</h2>
        <p class="description">
          With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment.
        </p>

        <!-- First row of cards -->
        <div class="events-grid-row">
          <div class="event-card">
            <div class="event-icon">
              <i class="fas fa-ticket" />
            </div>
            <div class="event-content">
              <h3 class="event-title">Online booking</h3>
              <p class="event-description">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>

          <div class="event-card">
            <div class="event-icon">
              <i class="fas fa-heart" />
            </div>
            <div class="event-content">
              <h3 class="event-title">Valentine's Day</h3>
              <p class="event-description">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>

          <div class="event-card">
            <div class="event-icon">
              <i class="fas fa-users" />
            </div>
            <div class="event-content">
              <h3 class="event-title">Family ticket</h3>
              <p class="event-description">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>
        </div>

        <!-- Second row of cards -->
        <div class="events-grid-row">
          <div class="event-card">
            <div class="event-icon">
              <i class="fas fa-gift" />
            </div>
            <div class="event-content">
              <h3 class="event-title">Prize draw</h3>
              <p class="event-description">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>

          <div class="event-card">
            <div class="event-icon">
              <i class="fas fa-theater-masks" />
            </div>
            <div class="event-content">
              <h3 class="event-title">Pop-up show</h3>
              <p class="event-description">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>

          <div class="event-card">
            <div class="event-icon">
              <i class="fas fa-popcorn" />
            </div>
            <div class="event-content">
              <h3 class="event-title">Free popcorn</h3>
              <p class="event-description">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Use booking module component -->
      <BookingBanner />
    </section>

    <!-- Add footer -->
    <TheFooter />
  </div>
</template>

<script setup>
import BookingBanner from '@/components/BookingBanner.vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<script>
export default {
  name: 'Home',
  components: {
    BookingBanner,
    TheNavbar,
    TheFooter
  },
  data() {
    return {
      currentCinemaPage: 0,
      categories: [
        {
          name: 'Action',
          images: ['action1.jpg', 'action2.jpg', 'action3.jpg', 'action4.jpg']
        },
        {
          name: 'Romance',
          images: ['romance1.jpg', 'romance2.jpg', 'romance3.jpg', 'romance4.jpg']
        },
        {
          name: 'Comedy',
          images: ['comedy1.jpg', 'comedy2.jpg', 'comedy3.jpg', 'comedy4.jpg']
        },
        {
          name: 'Drama',
          images: ['drama1.jpg', 'drama2.jpg', 'drama3.jpg', 'drama4.jpg']
        },
        {
          name: 'Horror',
          images: ['horror1.jpg', 'horror2.jpg', 'horror3.jpg', 'horror4.jpg']
        }
      ]
    }
  },
  methods: {
    prevCinemaPage() {
      if (this.currentCinemaPage > 0) {
        this.currentCinemaPage--
      }
    },
    nextCinemaPage() {
      if (this.currentCinemaPage < 1) {
        this.currentCinemaPage++
      }
    },
    goToCinemaSelect() {
      this.$router.push({ name: 'CinemaSelect' })
    },
    goToMovieDetails(movieId) {
      this.$router.push({
        path: '/movie-details',
        query: { id: movieId }
      })
    },
    goToMovieList() {
      this.$router.push({ name: 'MovieList' })
    }
  }
}
</script>

<style scoped>
/* Global background style */
.home {
  width: 100%;
  min-height: 100vh;
  background-color: #0A0A0A;
  color: #ffffff;
}

/* Ensure main content area is not covered by fixed navigation bar */
main {
  padding-top: 80px;
}

/* Hero section style */
.hero-section {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Movie poster wall style */
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

/* Upper layer text content */
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

/* Movie poster wall scrolling animation */
@keyframes scrollWall {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-66.666% - 2px));
  }
}

/* Remove extra mask gradient */
.hero-section::after {
  display: none;
}

/* Responsive adjustments */
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

/* Make sure two groups of posters are completely identical */
.movie-grid:first-child {
  margin-right: 0;
}

.movie-grid:last-child {
  margin-left: 0;
}

/* Add gradient effect for the last row of posters */
.poster-row:last-child img {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 50%,    /* Poster gradient starts halfway up */
    rgba(0, 0, 0, 0) 100%    /* Bottom is completely transparent */
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

/* Content area style */
.content-section {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(26, 26, 26, 0.8) 5%,   /* Quick gradient to dark gray */
    rgba(26, 26, 26, 1) 10%,    /* Completely opaque */
    rgba(26, 26, 26, 1) 100%    /* Keep opaque */
  );
  padding: 60px 120px;
  margin-top: -200px;  /* Move entire module up */
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px; /* Reduce spacing between modules */
}

/* Move category section up */
.category-section {
  margin-top: 40px;  /* Leave space for top gradient */
}

/* Ensure content displays correctly */
.section-header {
  position: relative;
  z-index: 2;
}

/* Bottom image gradient remains unchanged */
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

/* Generic title style */
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

/* Control button style */
.header-controls {
  display: flex;
  gap: 20px;  /* Reduce spacing */
  align-items: center;
}

.controls-wrapper {
  background: #1A1A1A;
  border-radius: 12px;
  padding: 4px;
  height: 52px;  /* Fixed height */
  display: flex;
  align-items: center;
}

.slider-controls {
  background: #2A2A2A;
  border-radius: 8px;
  padding: 4px;  /* Reduce padding */
  display: flex;
  align-items: center;
  gap: 16px;  /* Adjust spacing */
  height: 52px;
  min-width: 200px;
  justify-content: space-between;  /* Evenly distribute */
}

.dark-box {
  width: 40px;
  height: 40px;
  background: #1A1A1A;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;     /* Vertical center */
  justify-content: center; /* Horizontal center */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.arrow-icon {
  font-size: 16px;        /* Adjust arrow size */
  color: #FFFFFF;         /* Arrow color is white */
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
  display: flex;
  align-items: center;
  height: 52px; /* Match control button container height */
}

.view-all {
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 16px 24px; /* Adjust padding to make button taller */
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 100%; /* Fill parent container height */
  display: flex;
  align-items: center;
}

.view-all:hover {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
}

/* Category grid style optimization */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  width: 100%;
}

/* Category card style optimization */
.category-card {
  background: #212121;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  padding: 16px;
  border: 2px solid rgba(255, 255, 255, 0.15); /* Add border */
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

/* Bottom image gradient effect */
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

/* Ensure gradient effect remains during hover */
.category-card:hover .image-wrapper.bottom::after {
  opacity: 1;
}

/* Basic image container style */
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

/* Right bottom arrow style */
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

/* Hover effect */
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

/* Ensure image container displays correctly */
.image-wrapper {
  aspect-ratio: 1;
  background: #1A1A1A;
}

/* Cinema card container */
.cinema-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Cinema card style */
.cinema-card {
  background: #1A1A1A; /* Dark background */
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.15); /* Add border */
}

/* Cinema image */
.cinema-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* Cinema info area */
.cinema-info {
  padding: 20px;
}

/* Cinema title */
.cinema-info h3 {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

/* Cinema description */
.cinema-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 16px;
}

/* Rating and button area */
.rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Star rating */
.stars {
  color: #FFD700; /* Gold stars */
  font-size: 14px;
}

/* View details button */
.details-btn {
  background: #FF3B30; /* Red button */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.details-btn:hover {
  background: #E6352B;
}

/* Event card style */
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

/* SVG icon style */
.control-btn .svg-icon {
  width: 20px;
  height: 20px;
  color: #FFFFFF;
}

/* ... Other styles remain unchanged ... */

.control-btn-wrapper {
  width: 40px;
  height: 40px;
  background: #1A1A1A;
  border-radius: 4px;  /* Change to rounded square */
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
  border-radius: 4px;  /* Match parent container's rounded corners */
}

.nav-arrow {
  color: #FFFFFF;
  font-size: 18px;  /* Adjust arrow size */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;  /* Prevent text selection */
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
  padding-top: 120px;  /* Increase distance from movie wall */
  padding-bottom: 80px;  /* Bottom spacing */
}

.section-header {
  margin-bottom: 40px;  /* Title to content spacing */
}

h2 {
  margin: 0;
  padding: 0;
  font-size: 28px;  /* Optional: Adjust title size */
  font-weight: 600;
}

/* Module spacing */
.section + .section {
  margin-top: 80px;  /* Increase spacing between modules */
}

/* Module base style */
.module-section {
  margin-bottom: 100px;  /* Increase spacing between modules */
}

/* Last module does not need bottom spacing */
.module-section:last-child {
  margin-bottom: 0;
}

/* Add slide animation */
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
  min-height: 500px; /* Set a minimum height to ensure container height is sufficient */
}

.categories-grid {
  position: absolute;
  width: 100%;
}

/* Content area base style */
.content-section {
  padding: 120px 120px;
}

/* Category module bottom spacing */
.category-module {
  margin-bottom: -60px; /* Ensure no extra spacing */
}

/* Cinema module bottom spacing */
.cinema-module {
  margin-top: -60px; /* Move module up */
}

/* Events module title and description */
.events-section {
  margin-bottom: 40px;
}

.events-section h2 {
  font-size: 32px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.events-section .description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 40px;
  max-width: 800px;
}

/* Event card grid layout */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

/* Event card style */
.event-card {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

/* Icon style */
.event-icon {
  color: #FF3B30;
  font-size: 24px;
  margin-bottom: 16px;
}

/* Event title */
.event-title {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 12px;
}

/* Event description */
.event-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
}

/* Two row card layout */
.events-grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.events-grid-row:last-child {
  margin-bottom: 0;
}

/* Events module style */
.events-section {
  padding: 60px 0;
}

/* Event card grid */
.events-grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

/* Event card */
.event-card {
  background: rgba(18, 18, 18, 0.8); /* Darker background color */
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column; /* Change to vertical layout */
  gap: 16px;
}

/* Icon and title container */
.event-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Icon */
.event-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  color: #FF0000; /* Red icon */
}

/* Event title */
.event-title {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
}

/* Event description */
.event-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
  margin-top: 8px;
}

.find-cinema-btn {
  background-color: #FF0000;  /* Red background */
  color: #FFFFFF;  /* White text */
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 24px;
}

.find-cinema-btn:hover {
  background-color: #E60000;  /* Slightly darker red on hover */
}

.find-cinema-btn:active {
  transform: scale(0.98);  /* Press down effect on click */
}
</style>
