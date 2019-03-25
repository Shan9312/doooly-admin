import axios from 'axios'
import {
  Message
} from 'element-ui'
import { Auth, Utils } from '@/common'

const settings = {
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' }
}

const ajax = (method, url, data, options = {}) => {
  options = Object.assign(options, {
    method,
    url,
    data,
    baseURL: options.baseURL || settings.baseURL,
    headers: options.headers || settings.headers,
    timeout: 5000
  })

  const token = Auth.getToken()
  if (token) {
    options.headers['x-token'] = token
  }

  // console.log(options)

  return axios.request(options).then(res => {
      // console.log(res)
      return Promise.resolve(res)
    })
    .catch(err => {
      console.log('err' + err)
      Message({
        message: err.message || '服务器请求出错了~',
        type: 'error',
        duration: 5 * 1000
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