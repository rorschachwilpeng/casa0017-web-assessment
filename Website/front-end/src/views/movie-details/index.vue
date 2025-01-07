<template>
  <div class="movie-detail">
    <!-- 顶部大图部分 -->
    <div class="hero-section" :style="{ backgroundImage: `url(${movie.image})` }">
      <div class="overlay">
        <div class="hero-content">
          <h1>{{ movie.title }}</h1>
          <p>{{ movie.description }}</p>
          <div class="button-container">
            <button class="preview-btn" @click="playPreview">
              <i class="play-icon">▶</i> Play Previews
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情内容部分 -->
    <div class="content-section">
      <div class="main-content">
        <!-- 描述部分 -->
        <div class="description-box">
          <h3>Description</h3>
          <p>{{ movie.description }}</p>
        </div>

        <!-- 演员表部分 -->
        <div class="cast-section">
          <div class="section-header">
            <h3>Cast</h3>
            <div class="navigation-arrows">
              <button class="nav-arrow">←</button>
              <button class="nav-arrow">→</button>
            </div>
          </div>
          <div class="cast-list">
            <div v-for="actor in movie.cast" :key="actor.id" class="cast-item">
              <img :src="actor.image" :alt="actor.name">
            </div>
          </div>
        </div>

        <!-- 评论部分 -->
        <div class="reviews-section">
          <div class="section-header">
            <h3>Reviews</h3>
            <button class="add-review-btn">+ Add Your Review</button>
          </div>
          <div class="reviews-list">
            <div v-for="review in movie.reviews" :key="review.id" class="review-card">
              <div class="review-header">
                <h4>{{ review.author }}</h4>
                <p>From {{ review.location }}</p>
                <div class="rating">
                  <span v-for="n in 5" :key="n" :class="{ 'star-filled': n <= review.rating }">★</span>
                  <span class="rating-number">{{ review.rating }}</span>
                </div>
              </div>
              <p class="review-text">{{ review.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边信息栏 -->
      <div class="sidebar">
        <div class="info-block">
          <h4>Released Year</h4>
          <p>{{ movie.year }}</p>
        </div>
        <div class="info-block">
          <h4>Available Languages</h4>
          <div class="languages">
            <span v-for="lang in movie.languages" :key="lang">{{ lang }}</span>
          </div>
        </div>
        <div class="info-block">
          <h4>Ratings</h4>
          <div class="ratings-container">
            <div class="rating-item">
              <span>IMDb</span>
              <div class="stars">
                <span v-for="n in 5" :key="n" :class="{ 'star-filled': n <= movie.imdbRating }">★</span>
                <span>{{ movie.imdbRating }}</span>
              </div>
            </div>
            <div class="rating-item">
              <span>Streammybe</span>
              <div class="stars">
                <span v-for="n in 5" :key="n" :class="{ 'star-filled': n <= movie.streamRating }">★</span>
                <span>{{ movie.streamRating }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="info-block">
          <h4>Genres</h4>
          <div class="genres">
            <span v-for="genre in movie.genres" :key="genre">{{ genre }}</span>
          </div>
        </div>
        <div class="info-block">
          <h4>Director</h4>
          <div class="director-info">
            <img :src="movie.director.image" :alt="movie.director.name">
            <div>
              <p>{{ movie.director.name }}</p>
              <small>{{ movie.director.location }}</small>
            </div>
          </div>
        </div>
        <div class="info-block">
          <h4>Music</h4>
          <div class="music-info">
            <img :src="movie.music.image" :alt="movie.music.name">
            <div>
              <p>{{ movie.music.name }}</p>
              <small>{{ movie.music.location }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订票区域 -->
    <div class="booking-banner">
      <div class="booking-content">
        <h2>Book your tickets now!</h2>
        <p>This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.</p>
        <button class="book-ticket-btn">Book a Ticket</button>
      </div>
      <div class="booking-background"></div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h5>Home</h5>
          <ul>
            <li>Categories</li>
            <li>Devices</li>
            <li>Pricing</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Movies</h5>
          <ul>
            <li>Genres</li>
            <li>Trending</li>
            <li>New Release</li>
            <li>Popular</li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Cinemas</h5>
          <ul>
            <li>Locations</li>
            <li>Facilities</li>
            <li>New Release</li>
            <li>Popular</li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Support</h5>
          <ul>
            <li>Contact Us</li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Subscription</h5>
          <ul>
            <li>Plans</li>
            <li>Features</li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Connect With Us</h5>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>©2023 streammybe All Rights Reserved</p>
        <div class="footer-links">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MovieDetails',
  data() {
    return {
      movie: {
        image: 'https://example.com/path/to/kantara-hero.jpg',
        title: 'Kantara',
        description: 'A fiery young man clashes with an unflinching forest officer in a south Indian village where spirituality, fate and folklore rule the lands.',
        year: 2022,
        languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'],
        genres: ['Action', 'Adventure'],
        imdbRating: 4.5,
        streamRating: 4,
        director: {
          name: 'Rishab Shetty',
          location: 'From India',
          image: '/path/to/director.jpg'
        },
        music: {
          name: 'B. Ajaneesh Loknath',
          location: 'From India',
          image: '/path/to/music.jpg'
        },
        cast: [
          { id: 1, name: 'Actor1', image: '/path/to/actor1.jpg' },
          { id: 2, name: 'Actor2', image: '/path/to/actor2.jpg' },
          // ... 更多演员
        ],
        reviews: [
          {
            id: 1,
            author: 'Anikot Roy',
            location: 'India',
            rating: 4.5,
            text: 'This movie was recommended to me by a very dear friend who went for the movie by herself. I went to the cinemas to watch but had a houseful board so couldn\'t watch it.'
          },
          {
            id: 2,
            author: 'Swaraj',
            location: 'India',
            rating: 5,
            text: 'A restless king promises his lands to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace and peace of mind.'
          }
        ]
      }
    };
  },
  methods: {
    playPreview() {
      // 实现预览播放逻辑
      console.log('Playing preview...');
    }
  }
};
</script>

<style scoped>
.movie-detail {
  background-color: #111;
  color: #fff;
  min-height: 100vh;
}

.hero-section {
  height: 70vh; /* 保持原有高度 */
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
  display: flex;
  align-items: flex-end; /* 内容靠底部 */
  padding-bottom: 60px; /* 保持原有的底部间距 */
}

.hero-content {
  width: 100%;
  text-align: center;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 16px;
  color: #fff;
}

.hero-content p {
  font-size: 16px;
  margin-bottom: 24px;
  color: #fff;
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.button-container {
  display: flex;
  justify-content: center;
}

.preview-btn {
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.preview-btn:hover {
  background-color: #e60000;
}

.play-icon {
  font-size: 18px;
}

.content-section {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.description-box, .cast-section, .reviews-section, .info-block {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.cast-list {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
}

.cast-item img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.review-card {
  background: #222;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.star-filled {
  color: #ff0000;
}

.languages span, .genres span {
  background: #333;
  padding: 4px 12px;
  border-radius: 15px;
  margin-right: 8px;
  display: inline-block;
  margin-bottom: 8px;
}

.director-info, .music-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.director-info img, .music-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.navigation-arrows {
  display: flex;
  gap: 10px;
}

.nav-arrow {
  background: #333;
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.add-review-btn {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-section {
    grid-template-columns: 1fr;
  }
}

.booking-banner {
  position: relative;
  padding: 60px 20px;
  margin-top: 60px;
  overflow: hidden;
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7));
}

.booking-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/path/to/movie-collage.jpg');
  background-size: cover;
  opacity: 0.3;
  z-index: -1;
}

.booking-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
  position: relative;
  z-index: 1;
}

.booking-content h2 {
  font-size: 36px;
  margin-bottom: 16px;
  color: #fff;
}

.booking-content p {
  color: #ccc;
  margin-bottom: 24px;
  max-width: 600px;
}

.book-ticket-btn {
  background: #ff0000;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  float: right;
}

.footer {
  background: #1a1a1a;
  padding: 60px 20px 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
}

.footer-section h5 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 16px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.footer-section ul li:hover {
  color: #fff;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  color: #888;
  font-size: 20px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #fff;
}

.footer-bottom {
  max-width: 1200px;
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #888;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #fff;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
  }

  .booking-content {
    text-align: center;
  }

  .book-ticket-btn {
    float: none;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
