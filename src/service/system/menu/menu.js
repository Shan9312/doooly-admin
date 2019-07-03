import { Ajax } from '@/common'

export default {
  // 获取菜单列表
  /**
   *
   * @param {*} name: 菜单名称
   */
  getMenuList(name) {
    return Ajax.get('/menu/findMenuTree', { name })
  },

  // 新增菜单和按钮
  /**
   * @param {*} id: 菜单或按钮Id
   * @param {*} type: 菜单或按钮类型
   * @param {*} name: 菜单或按钮名称
   * @param {*} parentId: 上级菜单Id
   * @param {*} parentName: 上级菜单名称
   * @param {*} url: 菜单url
   * @param {*} isShow: 是否显示菜单
   * @param {*} perms: 按钮标识
   * @param {*} orderNum: 排序
   * @param {*} buttonUrl: 按钮对应接口地址
   * @param {*} icon: 菜单图标
   * @param {*} iconList: 菜单图标列表
   */
  editMenu(body) {
    return Ajax.post('/menu/save', body)
  },

  // 删除菜单
  /**
   *
   * @param {*} idList: 菜单ID列表
   */
  deleteMenu(idList) {
    return Ajax.post('/menu/delete', idList)
  }
}
