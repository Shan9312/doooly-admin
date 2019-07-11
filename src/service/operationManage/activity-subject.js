import { Ajax } from '@/common'

export default {
  // 获取专题列表
  /**
   *
   * @param {页码} pageNum
   * @param {每页数量} pageSize
   * @param {上下架状态 1.上架 2.下架} shelfStatus
   */
  getSubjectList({pageNum, pageSize, shelfStatus, title, updateEndDate, updateStartDate}) {
    return Ajax.post('/activity/specialTopicList', { pageNum, pageSize, shelfStatus, title, updateEndDate, updateStartDate})
  },
  /**
   * 复制专题
   * @param {活动id} id
   * @param {活动标题} title
   */
  copySubject(id, title) {
    return Ajax.post('/activity/copySpecialTopic', { id, title })
  },
  /**
   *下架专题
   * @param {下架时间} endDate
   * @param {活动id} id
   * @param {下架状态} status
   * @param {上架/下架} type
   */
  deleteSubject(endDate, id, status, type) {
    return Ajax.post('/activity/updateStatus', { endDate, id, status, type })
  },
  /**
   * 获取标题详情页面
   * @param {活动id} id
   */
  subjectDetail(id) {
    return Ajax.post('/activity/specialTopicDetail', { id })
  },
  /**
   * 编辑保存专题页
   * @param {模板列表} list
   * @param specialTopicInfo ={bgColor: "#FFFFFF"
   *         endDate: "2019-05-24 00:00:00"
   *         status: 1
   *        title: "第一个活动"
   *        } specialTopicInfo
   */
  updateSpecialTopic(list, specialTopicInfo, actSpecialFloatLayer) {
    return Ajax.post('/activity/updateSpecialTopic', { list, specialTopicInfo, actSpecialFloatLayer })
  }
}
