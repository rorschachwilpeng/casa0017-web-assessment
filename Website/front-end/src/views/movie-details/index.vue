<!-- eslint-disable -->
<template>
  <div v-loading="loading" class="movie-detail">
    <div v-if="movie" class="hero-section" :style="{ backgroundImage: movie.poster_url ? `url(http://localhost:3007${movie.poster_url})` : '' }">
      <div class="overlay">
        <div class="hero-content">
          <h1>{{ movie.name }}</h1>
          <p>{{ movie.description }}</p>
          <div class="button-container">
            <button class="preview-btn" @click="playTrailer">
              <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
              </svg>
              Play Previews
            </button>
          </div>
        </div>
      </div>
    </div>

    <section v-if="movie" class="content-section">
      <div class="content-layout">
        <div class="main-content">
          <!-- description -->
          <div class="description-section">
            <h3>Description</h3>
            <p>{{ movie.description }}</p>
          </div>

          <!-- Cast Section -->
          <div class="cast-section">
            <h2>Cast</h2>
            <div class="cast-list">
              <div
                v-for="(actor, index) in castArray"
                :key="index"
                class="cast-member"
              >
                <div v-if="!actorImages[actor]" class="cast-image-placeholder">
                  <i class="el-icon-user" />
                </div>
                <div v-else class="cast-image">
                  <img :src="`http://localhost:3007${actorImages[actor]}`" :alt="actor">
                </div>
                <span class="actor-name">{{ actor }}</span>
              </div>
            </div>
          </div>

          <div class="reviews-section">
            <div class="section-header">
              <h2 class="section-title">Reviews</h2>
            </div>
            <div class="reviews-list">
              <div
                v-for="review in displayedReviews"
                :key="review.review_id"
                class="review-card"
              >
                <div class="review-header">
                  <h4>{{ review.reviewer_name }}</h4>
                  <div class="review-rating">
                    <div class="stars">
                      <span
                        v-for="n in 5"
                        :key="n"
                        class="review-star"
                      >
                        <span v-if="getStarType(review.rating, n) === 'full'" class="star-filled">★</span>
                        <span v-else-if="getStarType(review.rating, n) === 'half'" class="star-half">★</span>
                        <span v-else class="star-empty">★</span>
                      </span>
                    </div>
                  </div>
                </div>
                <p class="review-text">{{ review.comment }}</p>
              </div>
            </div>
            <div class="pagination-controls">
              <button
                :disabled="currentPage === 0"
                class="nav-btn"
                @click="prevPage"
              >
                <i class="el-icon-arrow-left" />
              </button>
              <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
              <button
                :disabled="currentPage >= totalPages - 1"
                class="nav-btn"
                @click="nextPage"
              >
                <i class="el-icon-arrow-right" />
              </button>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="info-container">
            <div class="info-item">
              <h4>
                <i class="el-icon-date" />
                Released Year
              </h4>
              <p>{{ movie.released_year }}</p>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-film" />
                Director
              </h4>
              <p>{{ movie.director }}</p>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-time" />
                Length
              </h4>
              <p>{{ movie.length }}</p>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-chat-dot-square" />
                Available Languages
              </h4>
              <div class="languages-list">
                <span
                  v-for="lang in languagesList"
                  :key="lang"
                  class="language-tag"
                >
                  {{ lang }}
                </span>
              </div>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-star-on" />
                Ratings
              </h4>
              <div class="ratings-container">
                <div class="rating-item">
                  <span class="rating-label">IMDb</span>
                  <div class="stars">
                    <span
                      v-for="n in 5"
                      :key="n"
                      :class="['star',
                               n <= imdbStars ? 'star-filled' :
                               n - 0.5 <= imdbStars ? 'star-half' :
                               'star-empty']"
                    >
                      ★
                    </span>
                  </div>
                </div>
                <div class="rating-item">
                  <span class="rating-label">Streamvibe</span>
                  <div class="stars">
                    <span
                      v-for="n in 5"
                      :key="n"
                      :class="['star',
                               n <= streamvibeStars ? 'star-filled' :
                               n - 0.5 <= streamvibeStars ? 'star-half' :
                               'star-empty']"
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-item">
              <h4>
                <i class="el-icon-menu" />
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
    <div v-if="showPreviewModal" class="video-modal">
      <div class="modal-content">
        <button class="close-btn" @click="showPreviewModal = false">
          <span class="close-icon">×</span>
          <span class="close-text">Close</span>
        </button>
        <div class="video-wrapper">
          <iframe
            :src="getVideoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter.vue'
import request from '@/utils/request'

export default {
  name: 'MovieDetail',
  components: {
    TheFooter
  },
  data() {
    return {
      movie: null,
      loading: true,
      movieReviews: [],
      currentPage: 0,
      reviewsPerPage: 2,
      showPreviewModal: false,
      actorImages: {}
    }
  },
  computed: {
    languagesList() {
      return this.movie?.available_languages ? this.movie.available_languages.split(',').map(lang => lang.trim()) : []
    },
    castArray() {
      return this.movie?.cast ? this.movie.cast.split(',').map(name => name.trim()) : []
    },
    imdbStars() {
      return (this.movie?.rating_IMDb || 0) / 2
    },
    streamvibeStars() {
      return (this.movie?.rating_streamvibe || 0) / 2
    },
    displayedReviews() {
      const start = this.currentPage * this.reviewsPerPage
      const end = Math.min(start + this.reviewsPerPage, this.movieReviews.length)
      return this.movieReviews.slice(start, end)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.movieReviews.length / this.reviewsPerPage))
    },
    getVideoUrl() {
      if (!this.movie.trailer_url) return ''
      const videoId = this.movie.trailer_url.split('v=')[1]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
  },
  async created() {
    await Promise.all([
      this.fetchMovieDetails(),
      this.fetchMovieReviews()
    ])
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const movieId = this.$route.params.id
        const response = await request({
          url: `/api/movies/${movieId}`,
          method: 'get'
        })

        if (response.status === 0 && response.data) {
          this.movie = response.data
          await this.fetchActorImages()
        }
      } catch (error) {
        console.error('Failed to fetch movie details:', error)
        this.$message.error('Failed to load movie details')
      } finally {
        this.loading = false
      }
    },

    async fetchMovieReviews() {
      try {
        const movieId = this.$route.params.id
        console.log('Fetching reviews for movie:', movieId)

        const response = await request({
          url: `/api/movies/${movieId}/reviews`,
          method: 'get'
        })

        if (response.status === 0 && Array.isArray(response.data)) {
          // 使用 Set 去重
          const uniqueReviewIds = new Set()
          this.movieReviews = response.data
            .filter(review => {
              if (uniqueReviewIds.has(review.review_id)) {
                return false
              }
              uniqueReviewIds.add(review.review_id)
              return true
            })
            .map(review => ({
              review_id: review.review_id,
              reviewer_name: review.reviewer_name,
              rating: Number(review.rating),
              comment: review.comment,
              review_date: review.review_date
            }))

          this.currentPage = 0
          console.log('Unique reviews count:', this.movieReviews.length)
        } else {
          this.movieReviews = []
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
        this.$message.error('Failed to load reviews')
        this.movieReviews = []
      }
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
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

    getStarType(rating, position) {
      const starValue = rating / 2 // 将10分制转换为5星制
      if (position <= Math.floor(starValue)) {
        return 'full'
      } else if (position - 0.5 <= starValue) {
        return 'half'
      }
      return 'empty'
    },

    playTrailer() {
      this.showPreviewModal = true
    },

    async fetchActorImages() {
      if (!this.castArray || this.castArray.length === 0) return

      try {
        const response = await request({
          url: '/api/actors',
          method: 'get',
          params: {
            names: this.castArray.join(',')
          }
        })

        if (response.status === 0 && response.data) {
          this.actorImages = response.data.reduce((acc, actor) => {
            acc[actor.cast_name] = actor.picture
            return acc
          }, {})
        }
      } catch (error) {
        console.error('Failed to fetch actor images:', error)
      }
    }
  }
}
</script>
<style scoped>
.movie-detail {
  background-color: #111;
  color: #fff;
  min-height: 100vh;
  padding-top: 80px;
}

.hero-section {
  height: 70vh;
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
  align-items: flex-end;
  padding-bottom: 60px;
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

.description-section {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 40px;
}

.description-section h3 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  margin-bottom: 24px;
  margin-top: 0;
  font-weight: normal;
}

.cast-section {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 40px;
}

.cast-section h2 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 24px;
}

.cast-list {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.cast-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.review-text {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  margin-top: 4px;
}

.tag {
  background: rgba(51, 51, 51, 0.6);
  padding: 4px 12px;
  border-radius: 16px;
  display: inline-block;
  margin: 0 8px 8px 0;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.person-info {
  display: flex;
  gap: 12px;
  align-items: center;
  gap: 12px;
}

.cast-image-placeholder {
  width: 88px;
  height: 88px;
  background: rgba(26, 26, 26, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.cast-image-placeholder i {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.6);
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
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 40px;
}

.reviews-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  color: rgba(255, 255, 255, 0.6);
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
  background: #1A1A1A;
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
  justify-content: center;
  align-items: center;
  gap: 16px;
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
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.page-indicator.active {
  background-color: #ff0000;
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
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.person-info {
  margin-top: 8px;
}

.languages-list, .genres-list {
  margin-top: 8px;
}

.ratings-container {
  margin-top: 8px;
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

.review-star {
  font-size: 16px;
  position: relative;
  display: inline-block;
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
  left: 0;
  top: 0;
  width: 50%;
  color: #FF0000;
  overflow: hidden;
}

.star-empty {
  color: rgba(255, 255, 255, 0.3);
}

.review-rating .stars {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
}

.review-rating .rating-number {
  color: #FF0000;
  font-size: 14px;
}

.section-header .section-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  font-weight: normal;
  margin: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* 统一文字大小 */
.description-section p,
.cast-member .actor-name {
  font-size: 16px;
  color: #FFFFFF;
  line-height: 1.5;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  background: #000;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 6px 10px;
  cursor: pointer;
  z-index: 2000;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cast-image {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
  background-color: rgba(26, 26, 26, 0.6);
}

.cast-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

