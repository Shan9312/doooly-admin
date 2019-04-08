import axios from 'axios'
import {
  Message
} from 'element-ui'
import { Auth, Utils } from '@/common'
console.log(process.env.NODE_ENV)

const settings = {
  baseURL: '//39.98.195.15:8780',
  headers: { 'Content-Type': 'application/json' }
}

const ajax = (method, url, data, options = {}) => {
  options = Object.assign(options, {
    method,
    url,
    data,
    baseURL: process.env.NODE_ENV == 'production' ? settings.baseURL : '',
    headers: options.headers || settings.headers,
    timeout: 5000
  })

  const token = Auth.getToken()
  if (token) {
    options.headers['x-token'] = token
  }

  return axios.request(options).then(res => {
    const data = res.data;
    if (data.code == 200 && data.data) {
      return Promise.resolve(data)
    } else {
      Message({
        message: data.info || '服务器出错了',
        type: 'error',
        duration: 2 * 1000
      })
    }
  })
    .catch(err => {
      console.log('err' + err)
      Message({
        message: '网络请求出错了，请刷新重试~',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(err)
    })
}

export default {
  get(url, data) {
    let params = Utils.obj2Param(data)
    params = params.length > 0 ? `?${params}` : ''

    return ajax('get', `${url}${params}`)
  },
  post(url, data, options) {
    return ajax('post', url, data, options)
  }
}