const userModule = {
  namespaced: true,
  state: {
    userInfo: {
      id: 0,
      name: '文都学员',
      avatar: ''
    }
  },
  getters: {
    userInfo (state) { // (state, getters, rootState, rootGetters)
      return state.userInfo
    }
  },
  actions: {
    // ({ dispatch, commit, getters, rootGetters })
    setUserInfo: ({ commit }, value) => commit('SET_USERINFO', value),
    setUserID: ({ commit }, value) => commit('SET_USER_ID', value),
    setUserName: ({ commit }, value) => commit('SET_USER_NAME', value),
    setAvatar: ({ commit }, value) => commit('SET_AVATAR', value)
  },
  mutations: {
    SET_USERINFO: (state, value) => {
      state.userInfo = value
    },
    SET_USER_ID: (state, value) => {
      state.userInfo.id = value
    },
    SET_USER_NAME: (state, value) => {
      state.userInfo.name = value
    },
    SET_AVATAR: (state, value) => {
      state.userInfo.avatar = value
    }
  }
}
export default userModule
