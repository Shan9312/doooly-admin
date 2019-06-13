import { Ajax } from '@/common'
export default {
  /**
   *
   * @param {页码} pageNum
   * @param {每页数量} pageSize
   * @param {上下架状态 0.上架 1.下架} status
   */
  getHomePageList(pageNum, pageSize, status) {
    return Ajax.get('/homepage/spread/page', { pageNum, pageSize, status })
  },
  createHomePage(pageData) {
    return Ajax.post('/homepage/spread/insert', pageData)
  },
  getPageDetail(id) {
    return Ajax.get('/homepage/spread/detail', { id })
  },
  updateHomePage(pageData) {
    return Ajax.post('/homepage/spread/update', pageData)
  }
}
