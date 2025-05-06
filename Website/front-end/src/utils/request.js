import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3007',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 检查URL中是否包含原始参数占位符
    if (config.url.includes('/:id') || config.url.includes(':id')) {
      console.error('请求URL包含未替换的参数占位符:', config.url)
      // 返回被拒绝的Promise，中断请求
      return Promise.reject(new Error('请求URL包含未替换的参数占位符'))
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default request
