import Layout from '@/views/layout'
const reconRouter = {
  path: '/System',
  component: Layout,
  alwaysShow: true,
  name: 'System',
  redirect: '/System/Dept',
  meta: {
    title: '系统管理',
    icon: 'table',
  },
  children: [{
    path: 'Dept',
    name: 'Dept',
    component: () => import('@/views/system/dept/dept.vue'),
    meta: { title: '机构管理', icon: 'nested' },
  }, {
    path: 'Admin',
    name: 'Admin',
    component: () => import('@/views/system/user/user.vue'),
    meta: { title: '用户管理', icon: 'tree' }
  }, {
    path: 'Role',
    name: 'Role',
    component: () => import('@/views/system/role/role.vue'),
    meta: { title: '角色管理', icon: 'eye' }
  },{
    path: 'Menu',
    name: 'Menu',
    component: () => import('@/views/system/menu/menu.vue'),
    meta: { title: '菜单管理', icon: 'eye' }
  }]
}
export default reconRouter