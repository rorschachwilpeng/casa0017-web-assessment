import request from '@/utils/request'

export const moviesAPI = {
  // Get movie list
  getMovieList: () => {
    return request({
      url: '/api/movies',
      method: 'get'
    })
  },

  // Get single movie details
  getMovieDetails: (movieId) => {
    return request({
      url: `/api/movies/${movieId}`,
      method: 'get'
    })
  },

  // Add new movie
  addMovie: (movieData) => {
    return request({
      url: '/api/movies',
      method: 'post',
      data: movieData
    })
  },

  // Update movie information
  updateMovie: (movieId, movieData) => {
    return request({
      url: `/api/movies/${movieId}`,
      method: 'put',
      data: movieData
    })
  },

  // Delete movie
  deleteMovie: (movieId) => {
    return request({
      url: `/api/movies/${movieId}`,
      method: 'delete'
    })
  }
}

export default moviesAPI
