import { Ajax } from '@/common'

export default {
  // 获取商户订单入款列表
  orderList(query) {
    return Ajax.post('/api/reconciliInfo/getBusinessListPage', query)
  },

  // 导出订单
  exportExcel(query) {
    return Ajax.get('/api/reconciliInfo/exportExcel', query)
  }
}