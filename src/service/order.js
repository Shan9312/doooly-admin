import { Ajax } from '@/common'

export default {
  // 获取入款流水对账列表
  orderList(query) {
    return Ajax.post('order/orderInfo/get', query)
  },
  // 更新对账数据
  orderUpdate(body) {
    return Ajax.post('order/orderInfo/update', body)
  },
}