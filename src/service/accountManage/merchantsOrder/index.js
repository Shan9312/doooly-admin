import { Ajax } from '@/common'

export default {
  // 获取商户订单入款列表
  orderList(query) {
    return Ajax.post('/reconciliInfo/getBusinessListPage', query)
  },

  // 导出订单
  exportExcel(params) {
    window.location.href = `${process.env.VUE_APP_URL}reconciliInfo/exportExcel?${params}`
  }
}