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
    roles: ['operation', 'financial']
  },
  children: [
    {
      path: 'activitySubject',
      name: 'ActivitySubject',
      component: () => import(/* webpackChunkName: "operation" */ '@/views/operation-manage/activity-subject/index'),
      meta: { title: '活动专题列表', icon: 'nested' }
    },
    {
      path: 'edit/:id',
      name: 'ActivitySubjectEdit',
      hidden: true,
      meta: { title: '专题编辑页', icon: 'nested' },
      component: () => import(/* webpackChunkName: "operation" */ '@/views/operation-manage/activity-subject/edit/index')
    }
  ]
}
export default operationRouter
