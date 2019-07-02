import { Ajax } from '@/common'

export default {
  // 获取角色管理列表
  /**
   *
   * @param {搜索数据} body
   */
  getRoleList(body) {
    return Ajax.post('/role/findPage', body)
  },

  // 获取菜单列表
  getMenuList() {
    return Ajax.get('/menu/findMenuTree')
  },

  // 获取当前选中角色菜单授权列表
  getRoleMenus(id) {
    return Ajax.get('role/findRoleMenus', { roleId: id })
  },

  // 角色菜单授权提交
  saveRoleMenus(body, userId) {
    return Ajax.post(`/role/saveRoleMenus?userId=${userId}`, body)
  },

  // 新增编辑角色
  /**
   *
   * @param {数据} body
   */
  editRole(body) {
    return Ajax.post('/role/save', body)
  },

  // 删除角色
  /**
   *
   * @param {机构id} id
   */
  deleteRole(id) {
    return Ajax.post('/role/delete', id)
  }
}
