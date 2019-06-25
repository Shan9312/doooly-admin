import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Auth } from '@/common'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (Auth.getToken()) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const userInfo = sessionStorage.getItem('userInfo')

          const params = JSON.parse(userInfo)
          // 获取用户信息
          await store.dispatch('GetUserInfo', params.userId)

          // 根据用户信息获取对应的菜单路由
          const accessRoutes = await store.dispatch('GenerateRoutes', { userId: params.userId, email: params.email })

          // 获取对应的菜单按钮
          await store.dispatch('GenerateButtons', {userId: params.userId, name: params.email})
          
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
        } catch (error) {
          // 移除登录信息
          await store.dispatch('ResetToken')
          Message.error('登录失败')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})