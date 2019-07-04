import { Ajax } from '@/common'

export default {
  // 获取机构管理列表
  /**
   *
   * @param {机构名称} name: 机构名称
   */
  getDeptList(name) {
    return Ajax.get('/dept/findTree', { name })
  },

  // 新增编辑机构
  /**
   * @param {*} id: 机构ID，新增为0，修改为默认ID
   * @param {*} name: 机构名称
   * @param {*} parentId: 上级机构ID
   * @param {*} parentName: 上级机构名称
   * @param {*} orderNum: 排序
   */
  editDept({id, name, parentId, parentName, orderNum, createBy}) {
    return Ajax.post('/dept/save', {id, name, parentId, parentName, orderNum, createBy})
  },

  // 删除机构
  /**
   * @param {机构列表} idList: 机构ID列表
   */
  deleteDept(idList) {
    return Ajax.post('/dept/delete', idList)
  }
}
