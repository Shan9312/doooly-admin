export default {
  isvalidUsername(str) {
    const valid_map = ['admin', 'editor','nemo','test']
    return valid_map.indexOf(str.trim()) >= 0
  },
  isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
}