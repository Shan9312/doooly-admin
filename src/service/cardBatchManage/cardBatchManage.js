import { Ajax } from '@/common'

export default {
    // 新增卡批次
    handleAddTelCode(body) {
        return Ajax.post(`/adGift/addCardBatchNo`, body)
    },

    // 获取卡批次列表
    cardBatchNoList(body) {
        return Ajax.post(`/adGift/cardBatchNoList`, body)
    },

    // 卡批次详情列表
    getCardDetail(body) {
        return Ajax.post(`/adGift/cardDetail`, body)
    },

    // 设置为测试卡
    handleTestCard(body) {
        return Ajax.post(`/adGift/setNomalCard`, body)
    },

    //设置冻结
    handleStateCard(body) {
        return Ajax.post(`/adGift/setCardStatus`, body)
    }






}