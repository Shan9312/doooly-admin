export default {
  /**
   * 验证用户名
   * @param {*} str str登录用户名
   */
  isvalidUsername(str) {
    const valid_map = ['admin', 'financial', 'operation']
    return valid_map.indexOf(str.trim()) >= 0
  },

  /**
   * 是否需要打开外部链接
   * @param {*} str str路由链接
   */
  isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  },

  /**
   * 验证手机号是否正确
   * @param {*} rule 定义正则
   * @param {*} value 传入的值
   * @param {*} callback 返回函数
   */
  phoneValid(rule, value, callback) {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (rule.required) {
      if (!value) {
        callback(new Error('请输入手机号码'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确手机号码'));
      } else {
        callback();
      }
    } else if (value && !reg.test(value)) {
      callback(new Error('请输入正确手机号码'));
    } else {
      callback();
    }
  },

  /**
   * 支付宝账号验证
   * @param {*} rule 定义正则
   * @param {*} value 传入的值
   * @param {*} callback 返回函数
   */
  alipayVaild(rule, value, callback) {
    const reg = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/;
    if (rule.required) {
      if (!value) {
        callback(new Error('请输入支付宝账号'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确支付宝账号'));
      } else {
        callback();
      }
    } else if (value && !reg.test(value)) {
      callback(new Error('请输入正确支付宝账号'));
    } else {
      callback();
    }
  },

  /**
   * 支付宝姓名验证
   * @param {*} rule 定义正则
   * @param {*} value 传入的值
   * @param {*} callback 返回函数
   */
  alipayNameVaild(rule, value, callback) {
    const reg = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;
    if (rule.required) {
      if (!value) {
        callback(new Error('请输入支付宝姓名'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确支付宝姓名'));
      } else {
        callback();
      }
    } else if (value && !reg.test(value)) {
      callback(new Error('请输入正确支付宝姓名'));
    } else {
      callback();
    }
  },
  isUrl(url) {
    let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+/;
    return reg.test(url)
  }
}