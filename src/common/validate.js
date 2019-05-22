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
  isUrl(url){
    let reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    return  reg.test(url)
  }
}