import { Ajax } from '@/common'
export default {
  /**
   *
   * @param {页码} pageNum
   * @param {每页数量} pageSize
   * @param {上下架状态 true.上架 false.下架} onShelf
   */
  getHomePageList(pageNum, pageSize, onShelf) {
    return Ajax.get('/homepage/spread/page', { pageNum, pageSize, onShelf })
  },
  /**
   *
   * @param {*} pageData
   * eg:{name, startDate, endDate, imageUrl, formUrl, groups, type }
   * name：弹窗名称
   * startDate：生效时间
   * endDate：失效时间
   * imageUrl：图片地址
   * formUrl：跳转地址
   * groups：企业列表
   * type： 弹窗类型 1全部用户 2企业 3指定用户
   */
  createHomePage(pageData) {
    return Ajax.post('/homepage/spread/insert', pageData)
  },
  /**
   *
   * @param {弹窗id} id
   */
  getPageDetail(id) {
    return Ajax.get('/homepage/spread/detail', { id })
  },
  /**
   *
   * @param {*} pageData
   * eg:{ id, name, startDate, endDate, imageUrl, formUrl, groups, type }
   * id：弹窗id
   * name：弹窗名称
   * startDate：生效时间
   * endDate：失效时间
   * imageUrl：图片地址
   * formUrl：跳转地址
   * groups：企业列表
   * type： 弹窗类型 1全部用户 2企业 3指定用户
   */
  updateHomePage(pageData) {
    return Ajax.post('/homepage/spread/update', pageData)
  },
  getGroupAll() {
    return Ajax.post('/reconciliInfo/groupAll')
  },
  readExcel(formData) {
    return Ajax.post('/homepage/spread/readExcel/user', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  // 获取后端的oss参数信息
   getUploadMsg(){
    return Ajax.get('http://121.40.79.96:8904/upload/open/oss/policy')
  },
  
}
