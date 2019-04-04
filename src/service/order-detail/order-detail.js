import { Ajax } from '@/common'

export default {
  // 获取订单详情
  getOrderDetail(query) {
    return Ajax.get('/api/orderInfo/orderDetail', query)
  },
}