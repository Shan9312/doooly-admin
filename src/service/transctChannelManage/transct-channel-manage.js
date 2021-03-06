import { Ajax } from '@/common'

export default {
  /**
   * 获取交易流水的列表
   * {
   *  @param {*} orderNo: 订单号
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
  channelList({ orderNo, payType, merchantName, startCreateTime, endCreateTime, startPayEndTime, endPayEndTime, pageNum, pageSize }) {
    return Ajax.post('payment/payrecord/page',
    {
      orderNo,
      payType,
      merchantName,
      startCreateTime,
      endCreateTime,
      startPayEndTime,
      endPayEndTime,
      pageNum,
      pageSize,
    })
  },
  /**
   * 导出订单
   * {
   *  @param {*} orderNo: 订单号
   *  @param {*} payType: 所属企业
   *  @param {*} merchantName: 商家名称
   *  @param {*} startCreateTime: 订单下单开始日期
   *  @param {*} endCreateTime: 订单下单结束日期
   *  @param {*} startPayTime: 发起回收开始日期
   *  @param {*} endPayTime: 发起回收结束日期
   * }
   * */
  exportExcel(params) {
    window.location.href = `${process.env.VUE_APP_URL}payment/payrecord/excel?${params}`
  }
}