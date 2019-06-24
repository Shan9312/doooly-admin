import Layout from '@/views/layout'
const reconRouter = {
  path: '/accountManage',
  component: Layout,
  alwaysShow: true,
  name: 'AccountManage',
  redirect: '/accountManage/accountEntry',
  meta: {
    title: '对账管理',
    icon: 'table',
    roles: ['financial']
  },
  children: [{
    path: 'accountEntry',
    name: 'AccountEntry',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/account-entry/index'),
    meta: { title: '入账流水对账列表', icon: 'nested' },
  }, {
    path: 'merchantsOrder',
    name: 'MerchantsOrder',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/merchants-order/index'),
    meta: { title: '商户订单入款列表', icon: 'tree' }
  }, {
    path: 'orderDetail/:orderNumber/:userId/:businessId',
    name: 'OrderDetail',
    hidden: true,
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/order-detail/index'),
    meta: { title: '订单详情', icon: 'eye' }
  }, {
    path: 'reconExcel',
    name: 'ReconExcel',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/recon-excel/index'),
    meta: { title: '商户对账导出', icon: 'link' }
  }, {
    path: 'enterpriseExcel',
    name: 'EnterpriseExcel',
    component: () => import( /* webpackChunkName: "form" */ '@/views/account-manage/enterprise-excel/index'),
    meta: { title: '企业对账导出', icon: 'eye-open' }
  }]
}
export default reconRouter