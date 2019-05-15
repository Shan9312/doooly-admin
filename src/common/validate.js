export default {
  /**
   * 验证用户名
   * @param {*} str str登录用户名
   */
  isvalidUsername(str) {
    const valid_map = ['admin', 'editor', 'nemo', 'test']
    return valid_map.indexOf(str.trim()) >= 0
  },

  /**
   * 是否需要打开外部链接
   * @param {*} str str路由链接
   */
  isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
}