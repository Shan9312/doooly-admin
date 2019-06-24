import { Ajax } from '@/common'
import qs from 'qs';

export default {
  // 获取符合用户的菜单列表
  getPermission(query) {
    return Ajax.get(`/menu/findNavTree`, query)
  },
  // 获取符合用户的按钮列表
  getButtonsList(query) {
    return Ajax.get(`/user2/findPermissions`, query)
  },
}