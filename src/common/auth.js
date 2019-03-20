const TOKEN_KEY = 'doooly-admin-key'

export default {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token) {
    return localStorage.setItem(TOKEN_KEY, token)
  },
  removeToken() {
    return localStorage.setItem(TOKEN_KEY,'')
  }
}