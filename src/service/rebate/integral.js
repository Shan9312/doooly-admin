import { Ajax } from '@/common'

export default {
  // 获取用户返利积分类型
  getRebateIntegralType() {
    return Ajax.get(`/rebateIntegralType/get`)
  },
  // 提交用户返利积分更改
  saveRebateIntegralType(body) {
    return Ajax.post(`/rebateIntegralType/updateConfig`, body)
  },
}