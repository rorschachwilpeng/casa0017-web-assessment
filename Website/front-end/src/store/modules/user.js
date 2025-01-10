const state = {
  name: 'User',
  roles: ['admin']
}

const mutations = {
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  getInfo({ commit }) {
    commit('SET_ROLES', ['admin'])
    return Promise.resolve({
      data: {
        roles: ['admin'],
        name: 'User'
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


