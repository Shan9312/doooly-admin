import { LoginService } from '@/service'
import { Auth } from '@/common'

const user = {
  state: {
    userInfo: {},
    roles: []
  },

  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        LoginService.loginByUsername(userInfo.username, userInfo.password).then(res => {
          const data = res.data
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
            commit('SET_USER_INFO', data)
            Auth.setToken(data.token)
          } else {
            reject('loginByUsername: 角色列表不能为空')
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        LoginService.getUserInfo(Auth.getToken()).then(res => {
          const data = res.data
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
            commit('SET_USER_INFO', data)
            Auth.setToken(data.token)
          } else {
            reject('loginByUsername: 角色列表不能为空')
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        LoginService.logout().then(() => {
          commit('SET_USER_INFO', {})
          commit('SET_ROLES', [])
          Auth.removeToken()
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user