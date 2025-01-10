<template>
  <div class="movie-detail">
    <!-- 顶部大图部分 -->
    <div class="hero-section" :style="{ backgroundImage: `url(${movie.image})` }">
      <div class="overlay">
        <div class="hero-content">
          <h1>{{ movie.title }}</h1>
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
    </div>

    <!-- 修改内容区域的结构 -->
    <section class="content-section">
      <div class="content-layout">
        <!-- 左侧主要内容 -->
        <div class="main-content">
          <!-- 描述部分 -->
          <div class="info-block description-box">
            <h3>Description</h3>
            <p>{{ movie.description }}</p>
          </div>

          <!-- 演员表部分 -->
          <div class="info-block cast-section">
            <div class="section-header">
              <h3>Cast</h3>
              <div class="navigation-controls">
                <button class="nav-arrow" :class="{ disabled: true }" v-if="movie.cast.length <= itemsPerPage">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="nav-arrow" :class="{ disabled: currentCastPage === 0 }" @click="prevCastPage" v-else>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>

                <!-- 只有一页时显示单个红线 -->
                <div class="page-indicators" v-if="movie.cast.length <= itemsPerPage">
                  <div class="page-indicator active"></div>
                </div>

                <!-- 多页时显示页面指示器 -->
                <div class="page-indicators" v-else>
                  <div v-for="page in totalCastPages"
                       :key="page"
                       :class="['page-indicator', { active: currentCastPage === page - 1 }]">
                  </div>
                </div>

                <button class="nav-arrow" :class="{ disabled: true }" v-if="movie.cast.length <= itemsPerPage">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="nav-arrow" :class="{ disabled: currentCastPage === totalCastPages - 1 }" @click="nextCastPage" v-else>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="cast-list">
              <div v-for="actor in displayedCast" :key="actor.id" class="cast-item">
                <img :src="actor.image" :alt="actor.name">
                <span class="actor-name">{{ actor.name }}</span>
              </div>
            </div>
          </div>

          <!-- 评论部分 -->
          <div class="reviews-section">
            <div class="section-header">
              <h3>Reviews</h3>
              <button class="add-review-btn">+ Add Your Review</button>
            </div>
            <div class="reviews-container">
              <div class="reviews-list">
                <div
                  v-for="review in displayedReviews"
                  :key="review.id"
                  class="review-card"
                >
                  <div class="review-header">
                    <div class="reviewer-info">
                      <h4>{{ review.name }}</h4>
                      <p>{{ review.location }}</p>
                    </div>
                    <div class="review-rating">
                      <div class="stars">★★★★★</div>
                      <span class="rating-number">{{ review.rating }}</span>
                    </div>
                  </div>
                  <p class="review-text">{{ review.text }}</p>
                </div>
              </div>
            </div>
            <div class="pagination">
              <button
                class="nav-arrow"
                :class="{ disabled: reviewPage === 0 }"
                @click="prevReviewPage"
              >←</button>
              <div class="page-indicators">
                <div
                  v-for="index in totalPages"
                  :key="index"
                  class="page-indicator"
                  :class="{ active: reviewPage === index - 1 }"
                ></div>
              </div>
              <button
                class="nav-arrow"
                :class="{ disabled: reviewPage >= maxReviewPage }"
                @click="nextReviewPage"
              >→</button>
            </div>
          </div>
        </div>

        <!-- 修改右侧栏结构 -->
        <div class="sidebar">
          <div class="info-container">
            <!-- Released Year -->
            <div class="info-item">
              <h4>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Released Year
              </h4>
              <p>2022</p>
            </div>

            <!-- Available Languages -->
            <div class="info-item">
              <h4>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Available Languages
              </h4>
              <div class="languages-list">
                <span v-for="lang in movie.languages" :key="lang" class="tag">{{ lang }}</span>
              </div>
            </div>

            <!-- Ratings -->
            <div class="info-item">
              <h4>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Ratings
              </h4>
              <div class="ratings-container">
                <div class="rating-item">
                  <span>IMDb</span>
                  <div class="stars">
                    <span class="star-filled">★★★★</span><span class="star-half">★</span>
                    <span class="rating-number">4.5</span>
                  </div>
                </div>
                <div class="rating-item">
                  <span>Streamvibe</span>
                  <div class="stars">
                    <span class="star-filled">★★★★</span><span class="star-empty">★</span>
                    <span class="rating-number">4.0</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Genres -->
            <div class="info-item">
              <h4>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Genres
              </h4>
              <div class="genres-list">
                <span v-for="genre in movie.genres" :key="genre" class="tag">{{ genre }}</span>
              </div>
            </div>

            <!-- Director -->
            <div class="info-item">
              <h4>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Director
              </h4>
              <div class="person-info">
                <img :src="movie.director.image" :alt="movie.director.name">
                <div>
                  <p>{{ movie.director.name }}</p>
                  <small>{{ movie.director.location }}</small>
                </div>
              </div>
            </div>

            <!-- Music -->
            <div class="info-item">
              <h4>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 19C19.6569 19 21 17.6569 21 16C21 14.3431 19.6569 13 18 13C16.3431 13 15 14.3431 15 16C15 17.6569 16.3431 19 18 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Music
              </h4>
              <div class="person-info">
                <img :src="movie.music.image" :alt="movie.music.name">
                <div>
                  <p>{{ movie.music.name }}</p>
                  <small>{{ movie.music.location }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订票横幅 -->
      <BookingBanner />
    </section>

    <TheFooter />
  </div>
</template>

<script>
import BookingBanner from '@/components/BookingBanner.vue'
import TheFooter from '@/components/TheFooter.vue'
import request from '@/utils/request'

export default {
  name: 'MovieDetails',
  components: {
    BookingBanner,
    TheFooter
  },
  data() {
    return {
      loading: false,
      error: null,
      movie: {
        id: null,
        title: '',
        description: '',
        year: '',
        director: {
          name: '',
          location: '',
          image: ''
        },
        cast: [],
        languages: [],
        genres: [],
        rating: 0,
        imdbRating: 4.5,
        streamvibeRating: 4.0,
        length: '',
        image: '',
        music: {
          name: '',
          location: '',
          image: ''
        }
      },
      currentPage: 0,
      itemsPerPage: 6,
      reviewPage: 0,
      reviewsPerPage: 2,
      movieReviews: [
        {
          id: 1,
          name: "Anikot Roy",
          location: "India",
          rating: 4.5,
          text: "This movie was recommended to me by a very dear friend..."
        }
      ]
    }
  },
  computed: {
    displayedCast() {
      const start = this.currentPage * this.itemsPerPage
      return this.movie.cast.slice(start, start + this.itemsPerPage)
    },
    maxPage() {
      return Math.ceil(this.movie.cast.length / this.itemsPerPage) - 1
    },
    displayedReviews() {
      const start = this.reviewPage * this.reviewsPerPage
      return this.movieReviews.slice(start, start + this.reviewsPerPage)
    },
    maxReviewPage() {
      return Math.ceil(this.movieReviews.length / this.reviewsPerPage) - 1
    },
    totalPages() {
      return Math.ceil(this.movieReviews.length / this.reviewsPerPage)
    }
  },
  methods: {
    async fetchMovieDetails(movieId) {
      this.loading = true
      try {
        const response = await request({
          url: `/api/movies/${movieId}`,
          method: 'get'
        })

        if (response.data) {
          const movieData = response.data
          const posterUrl = movieData.poster_url
            ? (movieData.poster_url.startsWith('http')
              ? movieData.poster_url
              : `${process.env.VUE_APP_BASE_API}${movieData.poster_url}`)
            : ''

          this.movie = {
            id: movieData.id,
            title: movieData.name,
            description: movieData.description || 'No description available',
            year: movieData.release_year,
            director: {
              name: movieData.director || 'Unknown',
              location: 'From India',
              image: ''
            },
            cast: movieData.cast ? movieData.cast.split(',').map(name => ({
              id: Math.random(),
              name: name.trim(),
              image: ''
            })) : [],
            languages: movieData.languages ? movieData.languages.split(',') : [],
            genres: movieData.category ? [movieData.category] : [],
            rating: movieData.rating || 0,
            imdbRating: 4.5,
            streamvibeRating: 4.0,
            length: movieData.length || 'Unknown',
            image: posterUrl,
            music: {
              name: movieData.music || 'Unknown',
              location: 'From India',
              image: ''
            }
          }
        }
      } catch (error) {
        console.error('获取电影详情失败:', error)
        this.error = `Failed to load movie details: ${error.message}`
      } finally {
        this.loading = false
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.maxPage) {
        this.currentPage++
      }
    },
    prevReviewPage() {
      if (this.reviewPage > 0) {
        this.reviewPage--
      }
    },
    nextReviewPage() {
      if (this.reviewPage < this.maxReviewPage) {
        this.reviewPage++
      }
    }
  },
  created() {
    const movieId = this.$route.query.id
    if (movieId) {
      this.fetchMovieDetails(movieId)
    }
  },
  watch: {
    '$route.query.id': {
      handler(newId) {
        if (newId) {
          this.fetchMovieDetails(newId)
        }
      },
      immediate: true
    }
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
  margin-bottom: 30px;
}

.reviews-section {
  position: relative;
  margin-bottom: 30px;
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  overflow: hidden;
}

.cast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.cast-item img {
  width: 100px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.actor-name {
  text-align: center;
  font-size: 14px;
  color: #ffffff;
}

.review-card {
  background: rgba(33, 33, 33, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
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
}

.person-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
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
  margin-left: 4px;
  color: #FFFFFF;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(51, 51, 51, 0.6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-arrow:hover:not(.disabled) {
  background: rgba(71, 71, 71, 0.6);
}

.nav-arrow.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  background-color: #FF0000;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-review-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.add-review-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 1024px) {
  .content-section {
    padding: 40px 20px;
  }

  .content-layout {
    grid-template-columns: 1fr;
  }

  .cast-list {
    grid-template-columns: repeat(6, 1fr);
  }

  .cast-item img {
    width: 90px;
    height: 70px;
  }
}

/* 半透明灰色文字样式 */
.sidebar .info-block h4,          /* Released Year, Languages, Ratings */
.cast-section h3,                 /* Cast */
.section-header h3,               /* 其他标题 */
.review-card .reviewer-info p,    /* 评论者地址 */
.review-card .review-text {       /* 评论内容 */
  color: rgba(255, 255, 255, 0.6);
}

/* 标题样式 */
.sidebar .info-block h4,
.cast-section h3,
.section-header h3 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
}

/* 评论文字样式 */
.review-card .reviewer-info p,
.review-card .review-text {
  line-height: 1.6;
}

/* 白色文字样式 */
.review-card .reviewer-info h4,
.review-card .rating-number {
  color: #FFFFFF;
}

.review-card .reviewer-info h4 {
  margin-bottom: 4px;
}

/* 统一所有框的边框样式 */
.description-box,
.cast-section,
.reviews-section,
.info-block,
.review-card {
  background: rgba(26, 26, 26, 0.6);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05); /* 统一的深色边框 */
}

/* 大框的样式 */
.main-content .info-block {  /* Description, Cast, Reviews 大框 */
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

/* 评论卡片的特殊样式 */
.review-card {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  background: rgba(33, 33, 33, 0.6);
}

@media (max-width: 1024px) {
  .cast-list {
    grid-template-columns: repeat(6, 1fr);
  }
  .cast-item img {
    width: 90px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .cast-list {
    grid-template-columns: repeat(4, 1fr);
  }
  .cast-item img {
    width: 80px;
    height: 60px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between; /* 改为两端对齐 */
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.navigation-arrows {
  display: flex;
  gap: 8px; /* 控制两个箭头之间的间距 */
}

.nav-arrow {
  background: rgba(51, 51, 51, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-arrow:hover:not(.disabled) {
  background: rgba(71, 71, 71, 0.6);
}

.nav-arrow.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reviews-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.reviews-container {
  overflow: hidden;
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  gap: 20px;
  transition: transform 0.3s ease;
}

.review-card {
  background: rgba(33, 33, 33, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.review-header {
  margin-bottom: 12px;
}

.review-header h4 {
  color: #FFFFFF;
  margin: 0 0 4px 0;
  font-size: 16px;
}

.review-location {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 8px;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
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
  margin-left: 4px;
  color: #FFFFFF;
}

.review-text {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  font-size: 14px;
}

.add-review-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.add-review-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .reviews-list {
    grid-template-columns: 1fr; /* 小屏幕时改为单列 */
  }
}

.pagination {
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
</style>
