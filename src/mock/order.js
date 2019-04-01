import Mock from 'mockjs'
import { Utils } from '@/common'

const tableMap = []
const count = 100

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  tableMap.push(Mock.mock({
    id: Mock.Random.increment(),
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    orderNumber: 18550004166,
    content_short: '我是测试数据',
    content: baseContent,
    name: '@cname()',
    importance: '@integer(1, 3)',
    age: +Mock.Random.natural(1, 100),
    sex: +Mock.Random.natural(0, 1),
    address: Mock.Random.county(true),
    'status|1': ['published', 'draft', 'deleted'],
    date: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

export default {
  getOrderList: config => {
    const { name, mobile, age, page = 1, size = 10} = Utils.param2Obj(config.url)
    let mockList = tableMap.filter(item => {
      if (name && item.name !== +name) return false
      if (mobile && item.mobile !== mobile) return false
      if (age && item.age.indexOf(age) < 0) return false
      return true
    })

    const pageList = mockList.filter((item, index) => index < size * page && index >= size * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },
}