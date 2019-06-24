import { constantRouterMap } from '@/router'
import { PermissionService } from '@/service'
import Layout from '@/views/layout'

/**
 * 首字母小写转大写，动态路由只取/:之前
 * @param string
 */
function capitalize(string) {
  if (string) {
    string = segmentation(string)
    let words = string.split(' ');
    let i;
    for (i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  }
}

/**
 * 动态路由分割字符，只取/:之前
 * @param route
 */
function segmentation(route) {
  let str = route
  if (str && /(\S:)/g.test(str)) {
    str = str.split('/')[0];
  }
  return str;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, name='') {
  const res = []
  routes.forEach(item => {
    if (item.url && /\S/.test(item.url)) {
      item.url = item.url.replace(/^\//, '')
    }
    let route = {
      path: item.url,
      component: null,
      hidden: !item.isShow,
      name: capitalize(item.url),
      meta: {
        icon: 'nested',
        title: item.name
      }
    }
    if (name) {
      route['component'] = () => import(`@/views/${name}/${segmentation(item.url)}/index`)
    }
    if (item.children && item.children.length > 0) {
      route.path = `/${item.url}`
      route.component = Layout;
      route.alwaysShow = true;
      route.redirect = `${item.url}${item.children[0].url}`;
      route.children = filterAsyncRouter(item.children, item.url)
    }
    res.push(route)
  })
  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: [],
    buttons: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_BUTTON: (state, btn) => {
      state.buttons = btn
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        PermissionService.getPermission(data.roles).then(res => {
          let dynamicRoutes = filterAsyncRouter(res.data)
          commit('SET_ROUTERS', dynamicRoutes)
          resolve(dynamicRoutes)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GenerateButtons({ commit }, data) {
      return new Promise((resolve, reject) => {
        PermissionService.getButtonsList(data.roles).then(res => {
          commit('SET_BUTTON', res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default permission