const TOKEN_KEY = 'Authorization'

export default {
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY)
  },
  setToken(token) {
    return sessionStorage.setItem(TOKEN_KEY, token)
  },
  removeToken() {
    return sessionStorage.clear()
  }
}