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
