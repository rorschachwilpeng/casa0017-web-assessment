import request from '@/utils/request'

export const moviesAPI = {
  // 获取电影列表
  getMovieList: () => {
    return request({
      url: '/api/movies',
      method: 'get'
    })
  },

  // 获取单个电影详情
  getMovieDetails: (movieId) => {
    return request({
      url: `/api/movies/${movieId}`,
      method: 'get'
    })
  },

  // 添加新电影
  addMovie: (movieData) => {
    return request({
      url: '/api/movies',
      method: 'post',
      data: movieData
    })
  },

  // 更新电影信息
  updateMovie: (movieId, movieData) => {
    return request({
      url: `/api/movies/${movieId}`,
      method: 'put',
      data: movieData
    })
  },

  // 删除电影
  deleteMovie: (movieId) => {
    return request({
      url: `/api/movies/${movieId}`,
      method: 'delete'
    })
  }
}

export default moviesAPI
