import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = to.meta.title || 'Vue Admin Template'

  // 简化路由守卫逻辑，移除token验证
  try {
    // 获取用户信息
    await store.dispatch('user/getInfo')
    next()
  } catch (error) {
    Message.error(error || 'Has Error')
    next(`/`)
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
