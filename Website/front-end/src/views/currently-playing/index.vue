<template>
  <div class="app-container">
    <!-- Category Filter -->
    <div class="category-filter">
      <span class="category-label">Category : </span>
      <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
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
    <div class="movie-list">
      <div v-for="movie in moviesList" :key="movie.id" class="movie-card">
        <div class="movie-poster">
          <img :src="movie.poster" :alt="movie.name">
        </div>
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.name }}</h3>
          <div class="movie-meta">
            <span class="rating">Rating: {{ movie.rating }}%</span>
            <span class="length">Length: {{ movie.length }}</span>
          </div>
          <p class="movie-description">{{ movie.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrentlyPlaying',
  data() {
    return {
      categories: ['Drama', 'Comedy', 'Action', 'Horror', 'Romance'],
      selectedCategory: 'Drama',
      moviesList: [
        {
          id: 1,
          name: 'Paddington in Peru',
          rating: 98,
          length: '1h 46m',
          description: 'Paddington in Peru marks the delightful return of everyone\'s favourite marmalade-loving bear in this highly anticipated third instalment of the...',
          poster: 'https://example.com/paddington.jpg',
          category: 'Comedy'
        },
        {
          id: 2,
          name: 'Paddington in Peru',
          rating: 98,
          length: '1h 46m',
          description: 'Paddington in Peru marks the delightful return of everyone\'s favourite marmalade-loving bear in this highly anticipated third instalment of the...',
          poster: 'https://example.com/paddington.jpg',
          category: 'Comedy'
        },
        {
          id: 3,
          name: 'Paddington in Peru',
          rating: 98,
          length: '1h 46m',
          description: 'Paddington in Peru marks the delightful return of everyone\'s favourite marmalade-loving bear in this highly anticipated third instalment of the...',
          poster: 'https://example.com/paddington.jpg',
          category: 'Comedy'
        }
      ]
    }
  },
  methods: {
    handleCategoryChange(category) {
      console.log('Category changed to:', category)
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

    .movie-description {
      color: #666;
      line-height: 1.5;
      margin: 0;
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