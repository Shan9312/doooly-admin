import { Ajax } from '@/common'

export default {
  // 搜索商户名称
  getbusinessName(query) {
    return Ajax.post(`/reconciliInfo/businessList?businessName=${query}`)
  },
  // 商户对账导出
  export(params) {
    window.location.href = `${process.env.VUE_APP_URL}reconciliInfo/accountCheckExcel?${params}`
  }
}