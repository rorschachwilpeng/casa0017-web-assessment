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
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Moives', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Moives List', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Cenima List', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  {
    path: '/test',
    component: () => import('@/views/test/index.vue'),
    name: 'Test',
    meta: { title: 'API connection test' }
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
    path: '/crime-data',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CrimeData',
        component: () => import('@/views/crime-data/index'),
        meta: { title: 'Crime Data Analysis', icon: 'el-icon-warning' }
      }
    ]
  },

  {
    path: '/movie-details/:id',
    component: Layout,
    hidden: true,
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

