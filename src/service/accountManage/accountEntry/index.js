import { Ajax } from '@/common'

export default {
  /**
   * 获取入款流水对账列表
   * @param {对象参数} body
   */
  orderList(body) {
    return Ajax.post('/reconciliInfo/getListPage', body)
  },
  /**
   * 更新对账数据
   * @param {对象参数} body
   */
  orderUpdate(body) {
    return Ajax.post('/reconciliInfo/update', body)
  },
}
