import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/movies',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Movies',
        component: () => import('@/views/movies/index'),
        meta: { title: 'Movie Management', icon: 'el-icon-film' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/rorschachwilpeng/casa0017-web-assessment',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
  },

  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: 'Home', icon: 'el-icon-s-home' }
      }
    ]
  },

  {
    path: '/movie-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'MovieList',
        component: () => import('@/views/movie-list/index'),
        meta: { title: 'Movie List', icon: 'el-icon-video-camera' }
      }
    ]
  },

  {
    path: '/cinema-select',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CinemaSelect',
        component: () => import('@/views/cinema-select/index'),
        meta: { title: 'Cinema Selection', icon: 'el-icon-location' }
      }
    ]
  },

  {
    path: '/movie-details/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MovieDetails',
        component: () => import('@/views/movie-details/index'),
        meta: {
          title: 'Movie Details',
          icon: 'el-icon-video-camera',
          activeMenu: '/movie-list'
        }
      }
    ]
  },

  {
    path: '/seats',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/seats/index'),
        name: 'SeatSelection',
        meta: { title: 'Seat Selection', icon: 'chair' }
      }
    ]
  },

  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/about/index'),
        name: 'About',
        meta: { title: 'About', icon: 'el-icon-orange' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
