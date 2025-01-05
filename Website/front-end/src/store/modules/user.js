const state = {
  token: 'mock-token',
  name: 'Mock User',
  avatar: '',
  introduction: '',
  roles: ['admin']
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 登录
  login({ commit }) {
    commit('SET_TOKEN', 'mock-token')
    return Promise.resolve()
  },

  // 获取用户信息
  getInfo({ commit }) {
    commit('SET_ROLES', ['admin'])
    return Promise.resolve({
      data: {
        roles: ['admin'],
        name: 'Mock User',
        avatar: '',
        introduction: ''
      }
    })
  },

  // 登出
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    return Promise.resolve()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


