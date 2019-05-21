import { Ajax } from '@/common'

export default {
  // 获取专题列表
  getSubjectList(query) {
    return Ajax.post('/activity/specialTopicList', query)
  },
  // 复制专题
  copySubject(query) {
    return Ajax.post('/activity/copySpecialTopic', query)
  },
  // 下架专题
  deleteSubject(query) {
    return Ajax.post('/activity/updateStatus', query)
  },
  subjectDetail(query) {
    return Ajax.post('/activity/specialTopicDetail', query)
  },
  updateSpecialTopic(query) {
    return Ajax.post('/activity/updateSpecialTopic', query)
  }
}
