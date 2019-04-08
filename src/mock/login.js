import { Utils } from '@/common'

const userMap = [
  {
    id: 1,
    name: 'admin',
    pwd: '123456',
    token: 'token123',
    age: 18,
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: ['admin']
  },
  {
    id: 2,
    name: 'test',
    pwd: '123456',
    token: 'token234',
    age: 18,
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: ['test']
  }]

const data = {
  code: 200,
  data: null,
  info: '查询成功'
}

export default {
  loginByUsername: config => {
    const { username, password } = JSON.parse(config.body)
    const users = userMap.filter(user => user.name == username && user.pwd == password)
    data.data = users[0]
    return users.length > 0 ? data : {code: 201, info: '请输入正确的用户名和密码'}
  },
  getUserInfo: config => {
    const { token } = Utils.param2Obj(config.url)
    const users = userMap.filter(user => user.token == token)
    data.data = users[0]
    return users.length > 0 ? data : {}
  },
  logout: () => 'success'
}