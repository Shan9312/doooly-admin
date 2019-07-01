import { Ajax } from '@/common'

export default {
  // 获取机构管理列表
  /**
   *
   * @param {机构名称} name
   */
  getDeptList(name) {
    return Ajax.get('/dept/findTree', { name })
  },

  // 新增编辑机构
  /**
   *
   * @param {机构名称} body
   */
  editDept(body) {
    return Ajax.post('/dept/save', body)
  },

  // 删除单个机构
  /**
   *
   * @param {机构id} id
   */
  deleteDept(idList) {
    return Ajax.post('/dept/delete', idList)
  }
}
