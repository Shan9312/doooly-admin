import Layout from '@/views/layout'

const reconRouter = {
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
  }, {
    path: '/reconExcel',
    name: 'ReconExcel',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/reconExcel.vue'),
    meta: { title: '商户对账导出', icon: 'tree' }
  }, {
    path: '/enterpriseExcel',
    name: 'enterpriseExcel',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/enterpriseExcel.vue'),
    meta: { title: '企业对账导出', icon: 'tree' }
  }]
}
export default reconRouter
