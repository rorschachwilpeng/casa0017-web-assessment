import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加调试日志
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL,
      headers: config.headers
    })
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 添加调试日志
    console.log('Response Data:', response.data)
    return response.data
  },
  error => {
    // 增加更详细的错误日志
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    })
    return Promise.reject(error)
  }
)

export default service
