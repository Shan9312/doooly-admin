import { Ajax } from '@/common'

export default {
  // 获取菜单列表
  /**
   *
   * @param {机构名称} name
   */
  getMenuList(name) {
    return Ajax.get('/menu/findMenuTree', { name })
  },

  // 新增菜单和按钮
  /**
   *
   * @param {机构名称} body
   */
  editMenu(body) {
    return Ajax.post('/menu/save', body)
  },

  // 删除菜单
  /**
   *
   * @param {机构id} id
   */
  deleteMenu(idList) {
    return Ajax.post('/menu/delete', idList)
  }
}
