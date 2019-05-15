import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Auth } from '@/common'

NProgress.configure({ showSpinner: false })

// 判断登录权限
// function hasPermission(roles, permissionRoles) {
//   if (roles.includes('admin')) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const WHITE_LIST = ['/login', '/auth-redirect']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!Auth.getToken()) {
    if (WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0 || from.path == '/login') {
        store.dispatch('GetUserInfo').then(res => {
          const data = res.data
          const roles = data.roles
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('Logout').then(() => {
            Message.error(err)
            next({ path: '/' })
          })
        })
      }
      // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      // if (hasPermission(store.getters.roles, to.meta.roles)) {
      //   next()
      // } else {
      //   next({ path: '/401', replace: true, query: { noGoBack: true }})
      // }
      // // 可删 ↑
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})