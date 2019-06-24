import { Ajax } from '@/common'
import qs from 'qs';

export default {
  // 获取符合用户的菜单列表
  getPermission(email) {
    return Ajax.post(`/menu/findNavTree`,qs.stringify({ email: email }), {headers: {'Content-Type': 'application/x-www-form-urlencoded' }})
  },
  // 获取符合用户的按钮列表
  getButtonsList(name) {
    return Ajax.post(`/user2/findPermissions`, qs.stringify({ name: name }), {headers: {'Content-Type': 'application/x-www-form-urlencoded' }})
  },
}