import { Ajax } from '@/common'

export default {
  orderList(query) {
    return Ajax.get('/order/list', query)
  },
}