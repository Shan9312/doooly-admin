Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

let requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60) }
})()

function move(amount) {
  document.documentElement.scrollTop = amount
  document.body.parentNode.scrollTop = amount
  document.body.scrollTop = amount
}

function position() {
  return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
}

/**
 * 滚动到指定位置
 * @param {*} to 位置
 * @param {*} duration 滚动持续时间
 * @param {*} callback 回调方法
 */
const scrollTo = (to, duration, callback) => {
  const start = position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  var animateScroll = function () {
    currentTime += increment
    var val = Math.easeInOutQuad(currentTime, start, change, duration)
    move(val)
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else {
      if (callback && typeof (callback) === 'function') {
        callback()
      }
    }
  }
  animateScroll()
}

export default scrollTo