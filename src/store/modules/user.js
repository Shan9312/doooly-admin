import { LoginService } from '@/service'
import { Auth } from '@/common'

const user = {
  state: {
    token: Auth.getToken(),
    userInfo: {},
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        LoginService.login(userInfo.username, userInfo.password).then(res => {
          if (res.jwtToken) {
            commit('SET_USER_INFO', res)
            commit('SET_TOKEN', `Bearer ${res.jwtToken}`)
            Auth.setToken(`Bearer ${res.jwtToken}`)
            sessionStorage.setItem('userInfo', JSON.stringify({ name: res.userName, userId: res.userId, email: userInfo.username}))
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取登录用户角色
    GetUserInfo({ commit }, userinfo) {
      return new Promise(resolve => {
        commit('SET_ROLES', [userinfo])
        resolve()
      })
    },

    // 刷新页面
    SetRoles({ commit }) {
      commit('SET_ROLES', [])
    },

    // 退出
    Logout({ commit }) {
      commit('SET_USER_INFO', {})
      commit('SET_ROLES', [])
      Auth.removeToken()
    },

    // remove token
    ResetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Auth.removeToken()
        resolve()
      })
    },

  }
}

export default user