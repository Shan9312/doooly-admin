import { Ajax } from '@/common'

export default {
  /**
   * 获取交易流水的列表
   * {
   *  @param {*} merchantOrderNo: 订单号
   *  @param {*} payType: 所属企业
   *  @param {*} merchantName: 商家名称
   *  @param {*} startCreateTime: 订单下单开始日期
   *  @param {*} endCreateTime: 订单下单结束日期
   *  @param {*} startPayTime: 发起回收开始日期
   *  @param {*} endPayTime: 发起回收结束日期
   *  @param {*} pageNum: 列表页数 
   *  @param {*} pageSize: 列表页数量
   * }
   * */
  channelList({ merchantOrderNo, payTyp, merchantName, startCreateTime, endCreateTime, startPayTime, endPayTime, pageNum, pageSize }) {
    return Ajax.post('payment/payrecord/page',
    {
      merchantOrderNo,
      payTyp,
      merchantName,
      startCreateTime,
      endCreateTime,
      startPayTime,
      endPayTime,
      pageNum,
      pageSize,
    })
  },

  // /**
  //  * 获取回收商品的详情
  //  * {
  //  *  @param {*} orderNumber: 订单号
  //  * }
  //  * */
  // recycleGoodsDetail({ orderNumber }) {
  //   return Ajax.post('adOrderRecovery/getRecoveryOrderDetail', {
  //     orderNumber
  //   })
  // },

  // /**
  //  * 确认回款
  //  * {
  //  *  @param {*} orderNumber: 订单号
  //  *  @param {*} userId：用户ID
  //  * }
  //  * */
  // recycleConfirmOrder({ userId, orderNumber }) {
  //   return Ajax.post('adOrderRecovery/confirmTransferMoney', {
  //     userId,
  //     orderNumber
  //   })
  // },

  // /**
  //  * 修改回款信息
  //  * {
  //  *  @param {*} orderNumber: 订单号
  //  *  @param {*} userId：用户ID
  //  *  @param {*} alipayName: 支付宝姓名
  //  *  @param {*} alipayAccount: 支付宝账号
  //  * }
  //  * */
  // recycleEditOrder({ userId, orderNumber, alipayName, alipayAccount }) {
  //   return Ajax.post('adOrderRecovery/updateApplyMessage', {
  //     userId,
  //     orderNumber,
  //     alipayName,
  //     alipayAccount
  //   })
  // },
}