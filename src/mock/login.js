import { Utils } from '@/common'

const userMap = [
{
  id: 1,
  name: 'nemo',
  pwd: 'abc123',
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

export default {
  loginByUsername: config => {
    const { username, password } = JSON.parse(config.body)
    const users = userMap.filter(user => user.name == username && user.pwd == password)
    return users.length > 0 ? users[0] : {}
  },
  getUserInfo: config => {
    const { token } = Utils.param2Obj(config.url)
    const users = userMap.filter(user => user.token == token)
    return users.length > 0 ? users[0] : {}
  },
  logout: () => 'success'
}