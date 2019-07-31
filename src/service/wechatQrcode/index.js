import { Ajax } from '@/common'

export default {
  /**
   * 查询二维码列表
   * @param {string} title 主标题
   * @param {string} codeType 二维码类型（1下架 2上架）
   * @param {string} pageNum 第几页
   * @param {string} pageSize 一页几条
   */
  queryList(params) {
    return Ajax.post('/wechatCode/selectWechatCodeList', params)
  },

  /**
   * 编辑或新增二维码
   * @param {string} title 主标题
   * @param {string} subTitle 副标题
   * @param {int}    codeType 二维码类型（1临时 2永久）
   * @param {string} image 图片地址
   * @param {string} url 	图文消息跳转地址
   * @param {string} dictKey 活动编码（可以纯英文或英文+数字组成，不包含其他特殊字符，不超过15位，大写）
   */
  addQrcode(params) {
    return Ajax.post('/wechatCode/addOrUpdateWechatCode', params)
  },

  /**
   * 生成二维码接口
   * @param {int} id 	列表序号id
   */
  createQrcode(params) {
    return Ajax.post('/wechatCode/buildQRCode', params)
  },

  /**
   * 微信带参二维码详情页
   * @param {int} id 	列表序号id
   */
  queryDetail(params) {
    return Ajax.post('/wechatCode/wechatCodeDetail', params)
  }
}