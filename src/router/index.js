import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/views/layout'


/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [{
  path: '/login',
  name: 'Login',
  hidden: true,
  component: () => import( /* webpackChunkName: "main" */ '@/views/login')
},
{
  path: '/',
  name: 'Home',
  redirect: '/home',
  component: Layout,
  children: [{
    path: 'home',
    component: () => import( /* webpackChunkName: "main" */ '@/views/home'),
    meta: { title: '主页', icon: 'example' }
  },{
    path: 'user',
    name: 'User',
    hidden: true,
    component: () => import( /* webpackChunkName: "main" */ '@/views/home/user'),
    meta: { title: '用户列表', icon: 'example' }
  }]
},
{
  path: '/account-manage',
  component: Layout,
  alwaysShow: true,
  name: 'AccountManage',
  redirect: '/account-manage/account-entry',
  meta: {
    title: '对账管理',
    icon: 'table'
  },
  children: [{
    path: '/account-entry',
    name: 'AccountEntry',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/account-entry/index'),
    meta: { title: '入账流水对账列表', icon: 'nested' }
  }, {
    path: '/merchants-order',
    name: 'MerchantsOrder',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/merchants-order/index'),
    meta: { title: '商户订单入款列表', icon: 'tree' }
  }, {
    path: '/order-detail/:orderNumber/:userId/:businessId',
    name: 'OrderDetail',
    hidden: true,
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/order-detail/index'),
    meta: { title: '订单详情', icon: 'tree' }
  }]
}, {
  path: '/404',
  name: 'Page404',
  hidden: true,
  component: () => import( /* webpackChunkName: "error-page" */ '@/views/error-page/404')
},
{
  path: '/401',
  name: 'Page401',
  hidden: true,
  component: () => import( /* webpackChunkName: "error-page" */ '@/views/error-page/401')
}, {
  path: '*', redirect: '/404', hidden: true
}]


// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

export const asyncRouterMap = [

]

export default new VueRouter({
  mode: 'history',
  // base: '/reconcili/',
  routes: constantRouterMap,
  scrollBehavior: () => ({
    y: 0
  })
})