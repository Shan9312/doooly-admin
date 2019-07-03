import { Ajax } from '@/common'

export default {
  // 获取商户订单入款列表
  orderList(query) {
    return Ajax.post('/reconciliInfo/getBusinessListPage', query)
  },

  // 导出订单
  exportExcel(params) {
    const a = document.createElement('a'); // 创建a标签
    a.setAttribute('download', `${process.env.VUE_APP_URL}reconciliInfo/exportExcel?${params}`);// download属性
    a.setAttribute('href', `${process.env.VUE_APP_URL}reconciliInfo/exportExcel?${params}`);// href链接
    a.click();// 自执行点击事件
  }
}