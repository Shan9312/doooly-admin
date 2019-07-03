import { Ajax } from '@/common'
import qs from 'qs';

export default {
  // 获取用户管理列表
  /**
   *
   * @param {搜索数据} body
   */
  getUserList(body) {
    return Ajax.post('/user2/findPage', body)
  },

  // 获取部门列表
  /**
   *
   * @param {机构名称} name
   */
  getDeptList() {
    return Ajax.get('/dept/findTree')
  },

  // 重置用户密码
  resetPassword(body) {
    return Ajax.post('/user2/reset', qs.stringify(body), {headers: {'Content-Type': 'application/x-www-form-urlencoded' }})
  },

  // 修改密码
  editPassword(body) {
    return Ajax.post('/user2/update', body)
  },

  // 获取用户角色信息
  getUserRole() {
    return Ajax.get('/role/findAll')
  },

  // 新增编辑用户
  /**
   *
   * @param {数据} body
   */
  editUser(body) {
    return Ajax.post('/user2/save', body)
  },

  // 删除用户
  /**
   *
   * @param {机构id} id
   */
  deleteUser(id) {
    return Ajax.post('/user2/delete', id)
  }
}
