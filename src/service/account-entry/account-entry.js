import { Ajax } from '@/common'

export default {
  // 获取入款流水对账列表
  orderList(query) {
    return Ajax.post('/reconciliInfo/getListPage', query)
  },
  // 更新对账数据
  orderUpdate(body) {
    return Ajax.post('/reconciliInfo/update', body)
  },
}
