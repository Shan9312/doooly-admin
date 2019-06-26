import axios from 'axios'
import {
  Message
} from 'element-ui'
import { Auth, Utils } from '@/common'
import Config from '@/common/config'

const settings = {
  baseURL: process.env.NODE_ENV == 'production' ? Config.BASE_URL : '/',
  headers: { 'Content-Type': 'application/json', "Accept": "application/json, text/plain", }
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
    options.headers['Authorization'] = token
  }

  return axios.request(options).then(res => {
    const data = res.data;
    if (data.code == 200) {
      return Promise.resolve(data)
    } else {
      Message({
        message: data.info || data.msg || '服务器出错了',
        type: 'error',
        duration: 2 * 1000
      })
    }
  })
    .catch(err => {
      console.log('err' + err)
      Message({
        message: '网络连接出错了，请刷新页面重试~',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(err)
    })
}

export default {
  get(url, data, options) {
    let params = Utils.obj2Param(data)
    params = params.length > 0 ? `?${params}` : ''
    return ajax('get', encodeURI(`${url}${params}`), options)
  },
  post(url, data, options) {
    return ajax('post', encodeURI(url), data, options)
  },
  put(url, data, options) {
    return ajax('put', url, data, options)
  },
  delete(url, data, options) {
    return ajax('delete', url, data, options)
  }
}