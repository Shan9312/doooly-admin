import Layout from '@/views/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
  {
    path: 'complex-table',
    component: () => import('@/views/table/complex-table'),
    name: 'ComplexTable',
    meta: { title: 'complexTable', roles: ['test'] }
  }]
}
export default tableRouter