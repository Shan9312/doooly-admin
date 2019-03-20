import { Ajax } from '@/common'

export default {
  loginByUsername(username, password) {
    return Ajax.post('/login/login', {
      username,
      password
    })
  },
  getUserInfo(token) {
    return Ajax.get('/login/info', { token })
  },
  logout() {
    return Ajax.post('/login/logout')
  }
}