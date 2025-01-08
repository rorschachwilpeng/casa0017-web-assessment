<template>
  <div class="app-container">
    <!-- Category Filter -->
    <div class="category-filter">
      <span class="category-label">Category : </span>
      <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
        <el-radio-button label="All">All</el-radio-button>
        <el-radio-button v-for="category in categories" :key="category" :label="category">
          {{ category }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- Movie Count -->
    <div class="movie-count">
      {{ moviesList.length }} films in total
    </div>

    <!-- Movie List -->
    <div v-loading="loading" class="movie-list">
      <div v-for="movie in moviesList" :key="movie.id" class="movie-card" @click="goToMovieDetails(movie.id)">
        <div class="movie-poster">
          <img :src="'http://localhost:3007' + movie.poster_url" :alt="movie.name">
        </div>
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.name }}</h3>
          <div class="movie-meta">
            <span class="rating">Rating: {{ movie.rating }}%</span>
            <span class="length">Length: {{ movie.length }}</span>
          </div>
          <div class="movie-director">
            <strong>Director:</strong> {{ movie.director }}
          </div>
          <div class="movie-cast">
            <strong>Cast:</strong> {{ movie.cast }}
          </div>
          <p class="movie-description">{{ movie.description }}</p>
          <p class="movie-plot" v-if="showFullPlot">{{ movie.plot_summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'MovieList',
  data() {
    return {
      categories: ['Drama', 'Comedy', 'Action', 'Horror', 'Romance'],
      selectedCategory: 'All',
      moviesList: [],
      loading: false,
      showFullPlot: false
    }
  },
  created() {
    this.fetchMovies()
  },
  methods: {
    async fetchMovies() {
      this.loading = true
      try {
        const response = await request({
          url: '/api/movies',
          method: 'get',
          params: {
            category: this.selectedCategory === 'All' ? '' : this.selectedCategory
          }
        })
        this.moviesList = response.data
      } catch (error) {
        console.error('Failed to fetch movies:', error)
        this.$message.error('Failed to load movies')
      } finally {
        this.loading = false
      }
    },

    handleCategoryChange(category) {
      this.selectedCategory = category
      this.fetchMovies()
    },

    goToMovieDetails(movieId) {
      this.$router.push(`/movie-details/index?id=${movieId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.category-filter {
  margin-bottom: 20px;
  .category-label {
    margin-right: 10px;
    font-weight: bold;
  }
}

.movie-count {
  color: #666;
  margin-bottom: 20px;
}

.movie-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.movie-card {
  display: flex;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

  .movie-poster {
    flex: 0 0 200px;
    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
  }

  .movie-info {
    flex: 1;

    .movie-title {
      margin: 0 0 10px;
      font-size: 24px;
      color: #333;
    }

    .movie-meta {
      margin-bottom: 10px;
      color: #666;

      .rating, .length {
        margin-right: 20px;
      }
    }

    .movie-director, .movie-cast {
      margin-bottom: 10px;
      color: #666;

      strong {
        color: #333;
      }
    }

    .movie-description {
      color: #666;
      line-height: 1.5;
      margin-bottom: 10px;
    }

    .movie-plot {
      color: #666;
      line-height: 1.5;
      margin: 0;
      font-style: italic;
    }
  }
}

// Radio button styles
.el-radio-button__inner {
  padding: 8px 20px;
}

.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px 0 0 4px;
}

.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
}
</style>
