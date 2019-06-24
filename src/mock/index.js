import Mock from 'mockjs'

import loginAPI from './login'
import rouerPermission from './permission'

Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/info\.*/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)

// 权限路由
Mock.mock(/\/user\/menuId/, 'post', rouerPermission.routerMap)

export default Mock