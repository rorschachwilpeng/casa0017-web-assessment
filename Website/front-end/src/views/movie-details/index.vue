<template>
  <div class="movie-detail" v-loading="loading">
    <div v-if="movie" class="hero-section" :style="{ backgroundImage: movie.poster_url ? `url(http://localhost:3007${movie.poster_url})` : '' }">
      <div class="hero-content">
        <h1>{{ movie.name }}</h1>
        <p>{{ movie.description }}</p>
        <div class="button-container">
          <button class="preview-btn">
            <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor"/>
            </svg>
            Play Previews
          </button>
        </div>
      </div>
    </div>

    <section v-if="movie" class="content-section">
      <div class="content-layout">
        <!-- 左侧主要内容 -->
        <div class="main-content">
          <!-- 描述部分 -->
          <div class="info-block description-box">
            <h3>Description</h3>
            <p>{{ movie.description }}</p>
          </div>

          <!-- Cast Section -->
          <div class="content-section cast-section">
            <h2>Cast</h2>
            <div class="cast-list">
              <div v-for="(actor, index) in castArray" :key="index" class="cast-member">
                <div class="cast-image-placeholder">
                  <!-- 暂时使用占位符 -->
                  <i class="el-icon-user"></i>
                </div>
                <span class="actor-name">{{ actor }}</span>
              </div>
            </div>
          </div>

          <!-- 评论部分 -->
          <div class="info-block reviews-section">
            <div class="section-header">
              <h2>Reviews</h2>
              <button class="add-review-btn">+ Add Your Review</button>
            </div>
            <div class="reviews-list">
              <div v-for="review in movieReviews" :key="review.review_id" class="review-card">
                <div class="review-header">
                  <h4>{{ review.reviewer_name }}</h4>
                  <div class="review-rating">
                    <div class="stars">
                      <span v-for="n in 5" :key="n"
                            :class="['star', n <= (review.rating / 2) ? 'star-filled' : 'star-empty']">★</span>
                    </div>
                    <span class="rating-number">{{ review.rating }}/10</span>
                  </div>
                </div>
                <p class="review-text">{{ review.comment }}</p>
                <div class="review-date">{{ formatDate(review.review_date) }}</div>
              </div>
            </div>
            <!-- 分页控制 -->
            <div class="pagination-controls">
              <button @click="prevPage" :disabled="currentPage === 0" class="nav-btn">
                <i class="el-icon-arrow-left"></i>
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="nav-btn">
                <i class="el-icon-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <div class="info-container">
            <div class="info-item">
              <h4>
                <i class="el-icon-date"></i>
                Released Year
              </h4>
              <p>{{ movie.released_year }}</p>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-film"></i>
                Director
              </h4>
              <p>{{ movie.director }}</p>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-time"></i>
                Length
              </h4>
              <p>{{ movie.length }}</p>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-chat-dot-square"></i>
                Available Languages
              </h4>
              <div class="languages-list">
                <span v-for="lang in languagesList" :key="lang" class="language-tag">
                  {{ lang }}
                </span>
              </div>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-star-on"></i>
                Ratings
              </h4>
              <div class="ratings-container">
                <div class="rating-item">
                  <span class="rating-label">IMDb</span>
                  <div class="stars">
                    <span v-for="n in 5" :key="n"
                          :class="['star',
                            n <= imdbStars ? 'star-filled' :
                            n - 0.5 <= imdbStars ? 'star-half' :
                            'star-empty']">
                      ★
                    </span>
                  </div>
                </div>
                <div class="rating-item">
                  <span class="rating-label">Streamvibe</span>
                  <div class="stars">
                    <span v-for="n in 5" :key="n"
                          :class="['star',
                            n <= streamvibeStars ? 'star-filled' :
                            n - 0.5 <= streamvibeStars ? 'star-half' :
                            'star-empty']">
                      ★
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-menu"></i>
                Genres
              </h4>
              <div class="genres-list">
                <span>{{ movie.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <TheFooter />
  </div>
</template>

<script>
import BookingBanner from '@/components/BookingBanner.vue'
import TheFooter from '@/components/TheFooter.vue'
import request from '@/utils/request'

export default {
  name: 'MovieDetail',
  components: {
    BookingBanner,
    TheFooter
  },
  data() {
    return {
      movie: null,
      loading: true,
      movieReviews: [],
      currentPage: 0,
      reviewsPerPage: 2
    }
  },
  computed: {
    languagesList() {
      return this.movie.available_languages ? this.movie.available_languages.split(',').map(lang => lang.trim()) : []
    },
    castList() {
      return this.movie.cast ? this.movie.cast.split(',').map(name => name.trim()) : []
    },
    displayedReviews() {
      const start = this.currentPage * this.reviewsPerPage
      return this.movieReviews.slice(start, start + this.reviewsPerPage)
    },
    totalPages() {
      return Math.ceil(this.movieReviews.length / this.reviewsPerPage)
    },
    imdbStars() {
      return (this.movie.rating_IMDb || 0) / 2
    },
    streamvibeStars() {
      return (this.movie.rating_streamvibe || 0) / 2
    },
    parsedCast() {
      if (!this.movie.cast) return []
      try {
        return JSON.parse(this.movie.cast)
      } catch (e) {
        console.error('Failed to parse cast data:', e)
        return []
      }
    },
    castArray() {
      if (!this.movie.cast) return []
      return this.movie.cast.split(',').map(name => name.trim())
    }
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const movieId = this.$route.params.id;
        console.log('Fetching movie details for ID:', movieId);

        const response = await request({
          url: `/api/movies/${movieId}`,
          method: 'get'
        });

        if (response.status === 0 && response.data) {
          this.movie = {
            ...response.data,
            poster_url: response.data.poster_url || '',
            available_languages: response.data.available_languages || '',
            rating_IMDb: Number(response.data.rating_IMDb || 0),
            rating_streamvibe: Number(response.data.rating_streamvibe || 0),
            category: response.data.category || '',
            length: response.data.length || ''
          };
        }
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
        this.$message.error('Failed to load movie details');
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieReviews() {
      try {
        const movieId = this.$route.params.id;
        console.log('Fetching reviews for movie:', movieId);

        const response = await request({
          url: `/api/movies/${movieId}/reviews`,
          method: 'get'
        });

        if (response && response.data) {
          this.movieReviews = response.data.map(review => ({
            ...review,
            rating: Number(review.rating)
          }));
        } else {
          this.movieReviews = [];
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        this.$message.error('Failed to load reviews');
        this.movieReviews = [];
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  async created() {
    await Promise.all([
      this.fetchMovieDetails(),
      this.fetchMovieReviews()
    ]);
  }
}
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
  color: #FFFFFF;
  font-size: 48px;
  margin-bottom: 16px;
}

.hero-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.button-container {
  display: flex;
  justify-content: center;
}

.preview-btn {
  background-color: #FF0000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-btn:hover {
  background-color: #E60000;
  transform: scale(1.02);
}

.play-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.content-section {
  background: linear-gradient(
    to bottom,
    rgba(17, 17, 17, 0.95),
    rgba(17, 17, 17, 1)
  );
  padding: 60px 120px;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-block {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.main-content .info-block {
  background: rgba(26, 26, 26, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.description-box {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.description-box h3 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
}

.description-box p {
  color: #FFFFFF;
  line-height: 1.6;
  font-size: 16px;
}

.cast-section {
  background: rgba(26, 26, 26, 0.8);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
}

.cast-section h2 {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 24px;
}

.cast-list {
  display: flex;
  gap: 32px;
}

.cast-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cast-image-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cast-image-placeholder i {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.3);
}

.actor-name {
  color: #FFFFFF;
  font-size: 16px;
  text-align: center;
}

@media (max-width: 768px) {
  .cast-list {
    flex-wrap: wrap;
    gap: 24px;
  }

  .cast-image-placeholder {
    width: 100px;
    height: 100px;
  }

  .cast-image-placeholder i {
    font-size: 36px;
  }
}

.reviews-section {
  background: rgba(26, 26, 26, 0.8);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  color: #FFFFFF;
  font-size: 24px;
  margin: 0;
}

.add-review-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-review-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.review-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-header h4 {
  margin: 0;
  color: #fff;
  font-size: 16px;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #666;
}

.star-filled {
  color: #FFD700;
}

.star-empty {
  color: rgba(255, 255, 255, 0.3);
}

.review-text {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.review-date {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.page-indicators {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-indicator {
  width: 16px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3); /* 默认灰色 */
  transition: all 0.3s ease;
}

.page-indicator.active {
  background-color: #ff0000; /* 激活状态为红色 */
}

.page-info {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.sidebar {
  width: 300px;
}

.info-container {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-item {
  margin-bottom: 34px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item h4 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-bottom: 12px; /* 标题和内容之间的间距 */
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.person-info {
  margin-top: 8px; /* 人物信息的上边距 */
}

.languages-list, .genres-list {
  margin-top: 8px; /* 标签列表的上边距 */
}

.ratings-container {
  margin-top: 8px; /* 评分容器的上边距 */
}

.tag {
  background: rgba(51, 51, 51, 0.6);
  padding: 6px 12px;
  border-radius: 16px;
  display: inline-block;
  margin: 0 8px 8px 0;
  font-size: 14px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.person-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.person-info img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.person-info p {
  color: #fff;
  margin: 0;
}

.person-info small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.ratings-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-label {
  color: #FFFFFF;
  font-size: 14px;
}

.rating-value {
  color: #FF0000;
  font-weight: 500;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-item h4 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item h4 i {
  font-size: 18px;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    width: 100%;
  }
}

.icon {
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
  flex-shrink: 0;
}

.info-item h4 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.ratings-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-label {
  color: #FFFFFF;
  font-size: 14px;
}

.rating-value {
  color: #FF0000;
  font-weight: 500;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-item h4 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item h4 i {
  font-size: 18px;
}

.languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  background: rgba(51, 51, 51, 0.6);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ratings-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-label {
  color: #FFFFFF;
  font-size: 14px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 16px;
  position: relative;
}

.star-filled {
  color: #FF0000;
}

.star-half {
  position: relative;
  color: rgba(255, 255, 255, 0.3);
}

.star-half::before {
  content: '★';
  position: absolute;
  color: #FF0000;
  width: 50%;
  overflow: hidden;
  left: 0;
}

.star-empty {
  color: rgba(255, 255, 255, 0.3);
}

.rating-number {
  margin-left: 8px;
  color: #FF0000;
  font-size: 14px;
}

.language-tag {
  background: rgba(51, 51, 51, 0.6);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-block;
  margin: 0 8px 8px 0;
}

.genres-list {
  color: #FFFFFF;
  font-size: 14px;
}

.ratings-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.language-tag {
  background: rgba(51, 51, 51, 0.6);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-block;
}

.language-tag:hover {
  background: rgba(51, 51, 51, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>


