import { Ajax } from '@/common'

export default {
    // 搜索企业名称
    getEnterpriseName(query) {
        return Ajax.get(`/financial-statement/orphaned-point-transaction-record/group?nameMatch=${query}`)
    },
    // 搜索商户名称
    getbusinessName(query) {
        return Ajax.get(`/financial-statement/orphaned-point-transaction-record/merchant?nameMatch=${query}`)
    },
    // 获取积分兑换订单列表
    getIntegralExchangeList(body) {
        return Ajax.get('/financial-statement/orphaned-point-transaction-record', body)
    },
    // 积分兑换订单列表导出
    export (params) {
        window.location.href = `${process.env.VUE_APP_URL}financial-statement/orphaned-point-transaction-record/spread-sheet?${params}`
    },
    // 重新核对订单
    handleCheckOrder(body) {
        return Ajax.post('/financial-statement/orphaned-point-transaction-record/re-conciliate', body)
    },
}