import { Ajax } from '@/common'

export default {
  // 搜索企业名称
  getEnterpriseName(query) {
    return Ajax.post(`/reconciliInfo/groupList?groupName=${query}`)
  },
  // 搜索商户名称
  getbusniessName(query) {
    return Ajax.post(`/reconciliInfo/businessList?businessName=${query}`)
  },
  // 获取企业对账列表
  getEnterpriseList(body) {
    return Ajax.post('/reconciliInfo/groupAccount', body)
  },
  // 企业对账导出
  export(params) {
    window.location.href = `${process.env.VUE_APP_URL}reconciliInfo/groupAccountExcel?${params}`
  }
}