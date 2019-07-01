import { Ajax } from '@/common'

export default {
  /**
   * 获取回收商品的列表
   * {
   *  @param {*} orderNumber: 订单号
   *  @param {*} groupName: 所属企业
   *  @param {*} userId: 会员编号
   *  @param {*} orderState: 订单状态
   *  @param {*} recoveryState: 回收状态
   *  @param {*} userPhone: 手机号
   *  @param {*} orderStartTime: 订单下单开始日期
   *  @param {*} orderEndTime: 订单下单结束日期
   *  @param {*} recoveryStartTime: 发起回收开始日期
   *  @param {*} recoveryEndTime: 发起回收结束日期
   *  @param {*} pageNum: 列表页数 
   *  @param {*} rowCount: 列表页数量
   * }
   * */
  recycleGoodsList({ orderNumber, groupName, userId, orderState, recoveryState, userPhone, orderStartTime, orderEndTime, recoveryStartTime, recoveryEndTime, pageNum, rowCount }) {
    return Ajax.post('adOrderRecovery/getRecoveryOrderList',
    {
      orderNumber,
      groupName,
      userId,
      orderState,
      recoveryState,
      userPhone,
      orderStartTime,
      orderEndTime,
      recoveryStartTime,
      recoveryEndTime,
      pageNum,
      rowCount,
    })
  },

  /**
   * 获取回收商品的详情
   * {
   *  @param {*} orderNumber: 订单号
   * }
   * */
  recycleGoodsDetail({ orderNumber }) {
    return Ajax.post('adOrderRecovery/getRecoveryOrderDetail', {
      orderNumber
    })
  },

  /**
   * 确认回款
   * {
   *  @param {*} orderNumber: 订单号
   *  @param {*} userId：用户ID
   * }
   * */
  recycleConfirmOrder({ userId, orderNumber }) {
    return Ajax.post('adOrderRecovery/confirmTransferMoney', {
      userId,
      orderNumber
    })
  },

  /**
   * 修改回款信息
   * {
   *  @param {*} orderNumber: 订单号
   *  @param {*} userId：用户ID
   *  @param {*} alipayName: 支付宝姓名
   *  @param {*} alipayAccount: 支付宝账号
   * }
   * */
  recycleEditOrder({ userId, orderNumber, alipayName, alipayAccount }) {
    return Ajax.post('adOrderRecovery/updateApplyMessage', {
      userId,
      orderNumber,
      alipayName,
      alipayAccount
    })
  },
}