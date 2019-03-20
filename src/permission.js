import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Auth } from '@/common'

NProgress.configure({ showSpinner: false })

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
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})