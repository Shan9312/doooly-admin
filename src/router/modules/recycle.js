import Layout from '@/views/layout';

const recycleRouter = {
  path: '/recycleGoods',
  component: Layout,
  alwaysShow: true,
  name: 'RecycleGoods',
  redirect: '/recycleGoods/orderManage',
  meta: {
    title: '回收商品',
    icon: 'table',
    roles: ['recycle']
  },
  children: [
  {
    path: 'orderManage',
    name: 'OrderManage',
    redirect: '/recycleGoods/orderManage/orderList',
    component: () => import( /* webpackChunkName: "recycle" */ '@/views/recycle-goods/order-manage/index'),
    meta: { title: '订单管理', icon: 'nested' },
    children: [
    {
      path: 'orderList',
      name: 'OrderList',
      hidden: true,
      component: () => import( /* webpackChunkName: "recycle" */ '@/views/recycle-goods/order-manage/order-manage-list/index'),
      meta: { title: '订单列表' },
    },
    {
      path: 'orderDetail/:id',
      name: 'recycleOrderDetail',
      hidden: true,
      component: () => import( /* webpackChunkName: "recycle" */ '@/views/recycle-goods/order-manage/order-manage-detail/index'),
      meta: { title: '订单详情' },
    }, ],
  }, ],
};

export default recycleRouter;