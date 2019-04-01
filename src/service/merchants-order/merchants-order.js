import { Ajax } from '@/common'

export default {
  // 获取商户订单入款列表
  orderList(query) {
    return Ajax.get('order/list', query)
  },
}