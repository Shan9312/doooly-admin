import { Ajax } from '@/common'

export default {
  // 企业列表
  getEnterpriseList(query) {
    return Ajax.post(`/reconciliInfo/busniessList?businessName=${query}`)
  },
  // 搜索商户名称
  getbusniessName(query) {
    return Ajax.post(`/reconciliInfo/busniessList?businessName=${query}`)
  },
}