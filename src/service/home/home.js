import { Ajax } from '@/common'

export default {
  // 获取用户总数
  getUserTotal(query) {
    return Ajax.get('/Users/Total', query)
  },
  // 获取订单总数
  getOrderTotal(query) {
    return Ajax.get('/Orders/Total', query)
  },
  // 获取用户数据
  getUsers(query) {
    return Ajax.get(`/Users/Date/${query.startDate}/${query.endDate}`)
  },
 
}