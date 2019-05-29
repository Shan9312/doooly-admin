/**
 * 验证手机号是否正确
 * @param {*} rule 定义正则
 * @param {*} value 传入的值
 * @param {*} callback 返回函数
 */
const phoneValid = (rule, value, callback) => {
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
};

module.exports = {
  phoneValid,
}