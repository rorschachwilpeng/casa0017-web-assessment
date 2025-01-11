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

export default {
  name: 'MovieDetail',
  components: {
    BookingBanner,
    TheFooter,
    TheNavbar
  },
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
      },
      currentPage: 0,
      itemsPerPage: 6, // 每页显示的演员数量
      reviewPage: 0,
      reviewsPerPage: 2, // 每页显示2条评论
      movieReviews: [
        {
          id: 1,
          name: "Anikot Roy",
          location: "India",
          rating: 4.5,
          text: "This movie was recommended to me by a very dear friend who went for the movie by herself. I went to the cinemas to watch but had a houseful board so couldn't watch it."
        },
        {
          id: 2,
          name: "Swaraj",
          location: "India",
          rating: 5.0,
          text: "A restless king promises his lands to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace and peace of mind."
        },
        {
          id: 3,
          name: "Priya Sharma",
          location: "India",
          rating: 4.8,
          text: "The film masterfully weaves together tradition and modernity, creating a mesmerizing spectacle that resonates deeply with audiences. The stunning visuals, powerful performances, and haunting soundtrack work in perfect harmony. Every scene is carefully crafted, drawing viewers into a world where ancient folklore meets contemporary storytelling." // 约 50 个单词，显示完整
        },
        {
          id: 4,
          name: "Rahul Menon",
          location: "India",
          rating: 4.7,
          text: "The director has done an exceptional job in bringing this story to life. The attention to detail in portraying the local customs and traditions is remarkable. The performances are authentic and the background score elevates every scene."
        }
      ],
      currentCastPage: 0,
      itemsPerPage: 4, // 每页显示的演员数量
    };
  },
  computed: {
    maxPage() {
      return Math.ceil(this.movie.cast.length / this.itemsPerPage) - 1;
    },
    displayedCast() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.movie.cast.slice(start, end);
    },
    maxReviewPage() {
      return Math.ceil(this.movieReviews.length / this.reviewsPerPage) - 1;
    },
    totalPages() {
      return this.maxReviewPage + 1;
    },
    displayedReviews() {
      const start = this.reviewPage * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.movieReviews.slice(start, end);
    },
    totalCastPages() {
      return Math.ceil(this.movie.cast.length / this.itemsPerPage)
    },
    displayedCast() {
      const start = this.currentCastPage * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.movie.cast.slice(start, end)
    }
  },
  methods: {
    playPreview() {
      // 实现预览播放逻辑
      console.log('Playing preview...');
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.maxPage) {
        this.currentPage++;
      }
    },
    prevReviewPage() {
      if (this.reviewPage > 0) {
        this.reviewPage--;
      }
    },
    nextReviewPage() {
      if (this.reviewPage < this.maxReviewPage) {
        this.reviewPage++;
      }
    },
    prevCastPage() {
      if (this.currentCastPage > 0) {
        this.currentCastPage--
      }
    },
    nextCastPage() {
      if (this.currentCastPage < this.totalCastPages - 1) {
        this.currentCastPage++
      }
    }
  }
};
</script>
<style scoped>
.movie-detail {
  background-color: #111;
  color: #fff;
  min-height: 100vh;
  padding-top: 80px;
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


