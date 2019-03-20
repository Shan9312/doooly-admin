import Layout from '@/views/layout'

const nestedRouter = {
  path: '/nested',
  name: 'Nested',
  redirect: '/nested/menu1',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: 'Nested',
    icon: 'nested'
  },
  children: [
  {
    path: 'menu1',
    name: 'Menu1',
    component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu1/index'),
    meta: { title: 'Menu1' },
    children: [
    {
      path: 'menu1-1',
      name: 'Menu1-1',
      component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu1/menu1-1'),
      meta: { title: 'Menu1-1' }
    },
    {
      path: 'menu1-2',
      name: 'Menu1-2',
      component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu1/menu1-2'),
      meta: { title: 'Menu1-2' },
      children: [
      {
        path: 'menu1-2-1',
        name: 'Menu1-2-1',
        component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu1/menu1-2/menu1-2-1'),
        meta: { title: 'Menu1-2-1' }
      },
      {
        path: 'menu1-2-2',
        name: 'Menu1-2-2',
        component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu1/menu1-2/menu1-2-2'),
        meta: { title: 'Menu1-2-2' }
      }]
    },
    {
      path: 'menu1-3',
      name: 'Menu1-3',
      component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu1/menu1-3'),
      meta: { title: 'Menu1-3' }
    }]
  },
  {
    path: 'menu2',
    name: 'Menu2',
    component: () => import( /* webpackChunkName: "nested" */ '@/views/nested/menu2/index'),
    meta: { title: 'menu2' }
  }]
}

export default nestedRouter