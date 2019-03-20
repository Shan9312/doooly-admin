import { Ajax } from '@/common'

export default {
  fetchList(query) {
    return Ajax.get('/article/list', query)
  },
  fetchArticle(id) {
    return Ajax.get('/article/detail', { id })
  },
  fetchPv(pv) {
    return Ajax.get('/article/pv', { pv })
  },
  createArticle(data) {
    return Ajax.post('/article/create', data)
  },
  updateArticle(data) {
    return Ajax.post('/article/update', data)
  }
}