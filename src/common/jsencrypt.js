import JsEncrypt from 'jsencrypt'
const KEY_PUBLIC = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCEh9E53hhO4hTFyn+m5HV0GJPp3RaqYos1UXrG0CW8MINSSDIW/oUnNmcNfX1JOI+Olkpxqyy11fdTl0esXW7dXDdpI153+ZO51tKSSAOhL7uuYNBc5PV/Rjy+l+9m+mV/mcJGTbJCSFsyfvQGVPORIofUwP1dTydX5W2dKFA6gQIDAQAB'

/**
 * 将特殊数据进行加密
 * @param str {加密的数据}
 */
export function encryption(str) {
  let val;
  let jse = new JsEncrypt;
  jse.setPublicKey(KEY_PUBLIC);
  val = jse.encrypt(str)
  return val
}