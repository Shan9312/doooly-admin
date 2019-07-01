import { Ajax } from '@/common'

export default {
  // 获取符合用户的菜单列表
  getPermission(query) {
    return Ajax.post(`/menu/findNavTree`, query)
  },
  // 获取符合用户的按钮列表
  getButtonsList(query) {
    return Ajax.post(`/user2/findPermissions`, query)
  },
}