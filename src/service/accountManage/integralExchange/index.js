import { Ajax } from '@/common'

export default {
  // 搜索企业名称
  getEnterpriseName(query) {
    return Ajax.post(`/reconciliInfo/groupList?groupName=${query}`)
  },
  // 搜索商户名称
  getbusinessName(query) {
    return Ajax.get(`/financial-statement/advance-point-payment-order/business?nameMatch=${query}`)
  },
  // 获取积分兑换订单列表
  getIntegralExchangeList(body) {
    return Ajax.get('/financial-statement/advance-point-payment-order', body)
  },
  // 积分兑换订单列表导出
  export(params) {
    window.location.href = `${process.env.VUE_APP_URL}financial-statement/advance-point-payment-order/spread-sheet?${params}`
  }
}