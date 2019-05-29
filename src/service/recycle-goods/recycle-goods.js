import { Ajax } from '@/common'

export default {
  // 获取回收商品的列表
  recycleGoodsList(query) {
    return Ajax.post('adOrderRecovery/getRecoveryOrderList', query)
  },
  // 获取回收商品的详情
  recycleGoodsDetail(query) {
    return Ajax.post('adOrderRecovery/getRecoveryOrderDetail', query)
  },
  // 确认回款
  recycleConfirmOrder(body) {
    return Ajax.post('adOrderRecovery/confirmTransferMoney', body)
  },
  // 修改回款信息
  recycleEditOrder(body) {
    return Ajax.post('adOrderRecovery/updateApplyMessage', body)
  },
}