import { Ajax } from '@/common'

export default {
  // 搜索商户名称
  getbusniessName(query) {
    return Ajax.post(`/reconciliInfo/businessList?businessName=${query}`)
  },
}