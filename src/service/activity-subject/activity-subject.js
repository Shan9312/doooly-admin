import { Ajax } from '@/common'

export default {
  // 获取专题列表
  getSubjectList(query) {
    return Ajax.post('/activity/specialTopicList', query)
  },
}