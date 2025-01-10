import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 跳过认证相关的请求
    if (config.url.includes('/user/info')) {
      return Promise.reject('Skipped auth check')
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    // 如果是跳过的认证请求，不显示错误
    if (error === 'Skipped auth check') {
      return Promise.resolve({
        code: 20000,
        data: {
          roles: ['admin'],
          introduction: 'mock user',
          avatar: '',
          name: 'Mock User'
        }
      })
    }

    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
