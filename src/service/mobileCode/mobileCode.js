import { Ajax } from '@/common'

export default {
    // 新增白名单
    handleAddTelCode(tel) {
        return Ajax.post(`/quality-assurance/sms-code-generator/tester?tel=${tel}`)
    },

    //  手动生成验证码
    handleGetCode(bizId, codeType, testerTel) {
        return Ajax.post(`/quality-assurance/sms-code-generator/code?bizId=${bizId}&codeType=${codeType}&testerTel=${testerTel}`)
    },

    // 查看已生成的白名单手机
    getWhiteTel(limit, page, tel) {
        return Ajax.get(`/quality-assurance/sms-code-generator/tester?limit=${limit}&page=${page}&tel=${tel}`)
    },

    // 删除白名单手机好
    handleDelTel(tel) {
        return Ajax.delete(`/quality-assurance/sms-code-generator/tester?tel=${tel}`)
    }




}