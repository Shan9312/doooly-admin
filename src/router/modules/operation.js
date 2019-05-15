import Layout from '@/views/layout'

const operationRouter = {
  path: '/operationManage',
  component: Layout,
  alwaysShow: true,
  name: 'OperationManage',
  redirect: '/operationManage/activitySubject',
  meta: {
    title: '运营管理',
    icon: 'table',
    roles: ['operation']
  },
  children: [{
    path: 'activitySubject',
    name: 'ActivitySubject',
    component: () => import( /* webpackChunkName: "operation" */ '@/views/operation-manage/activity-subject/index'),
    meta: { title: '活动专题列表', icon: 'nested' },
    children: [
    {
      path: 'edit/:id',
      name: 'ActivitySubjectEdit',
      hidden: true,
      component: () => import( /* webpackChunkName: "operation" */ '@/views/operation-manage/activity-subject/edit/index')
    }]
  }]
}
export default operationRouter