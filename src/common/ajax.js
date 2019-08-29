import axios from 'axios'
import {
  Message
} from 'element-ui'
import { Auth, Utils } from '@/common'
import router from '@/router'

const settings = {
  baseURL: process.env.NODE_ENV == 'production' ? process.env.VUE_APP_URL : '/',
  headers: { 'Content-Type': 'application/json', "Accept": "application/json, text/plain", }
}
const ajax = (method, url, data, options = {}) => {
  options = Object.assign(options, {
    method,
    url,
    data,
    baseURL: options.baseURL || settings.baseURL,
    headers: options.headers || settings.headers,
    timeout: 60000
  })

  const token = Auth.getToken()
  if (token) {
    options.headers['Authorization'] = token
  }

  return axios.request(options).then(res => {
    const data = res.data;
    if (data.code == 200 || data.code == 1000 ) {
      return Promise.resolve(data)
    } else if (data.code == 401) {
      Message({
        message: '账号信息过期，请重新登录！',
        type: 'error',
        duration: 2 * 1000
      })
      Auth.removeToken()
      router.replace({
        path: 'login',
        query: { redirect: router.currentRoute.fullPath }
      })
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
    return ajax('get', `${url}${params}`, options)
  },
  post(url, data, options) {
    return ajax('post', url, data, options)
  },
  put(url, data, options) {
    return ajax('put', url, data, options)
  },
  delete(url, data, options) {
    return ajax('delete', url, data, options)
  }
}