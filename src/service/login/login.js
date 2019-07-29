import { Ajax } from '@/common'
import qs from 'qs';

export default {
  /**
   * 登录
   * @param {用户名} username
   * @param {密码} password
   */
  login(username, password) {
    return Ajax.post('/login', qs.stringify({ username, password }), {headers: {'Content-Type': 'application/x-www-form-urlencoded' }})
  }
}