import scrollTo from './scrollTo'


const cleanArray = (actual) => {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * object对象转换成url后面拼接的param
 * @param {*} obj obj对象
 */
const obj2Param = (obj) => {
  if (!obj) return ''
  return cleanArray(
    Object.keys(obj).map(key => {
      if (obj[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
  ).join('&')
}

/**
 * url后面带的param转换成object对象
 * @param {*} url url
 */
const param2Obj = (url) => {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') +
    '"}'
  )
}

/**
 * 格式化时间
 * @param {*} time 时间
 * @param {*} cFormat 格式化格式
 */
const formatTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export default {
  obj2Param,
  param2Obj,
  formatTime,
  scrollTo
}