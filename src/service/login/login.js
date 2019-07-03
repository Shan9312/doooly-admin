import { Ajax } from '@/common'
import qs from 'qs';

export default {
  login(username, password) {
    return Ajax.post('/login', qs.stringify({ username, password }), {headers: {'Content-Type': 'application/x-www-form-urlencoded' }})
  },
  getUserInfo(token) {
    return Ajax.get('/login/info', { token })
  },
  logout() {
    return Ajax.post('/login/logout')
  }
}