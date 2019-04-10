/**Vue全家桶 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@babel/polyfill';


/**引入第三方插件库 */
import ElementUI from 'element-ui'
Vue.use(ElementUI)

/**引入公共样式 */
import 'normalize.css/normalize.css'
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import '@/styles/index.less'
import './assets/css/icon.css';

/**注册全局组件  */
import Components from './components'
Object.keys(Components).forEach(compName => {
  Vue.component(compName, Components[compName])
})

/**引入svg  */
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
requireAll(req)

/**引入权限判断 */
import './permission'

/**mockjs */
import './mock'

Vue.config.productionTip = false
// Vue.directive('filterSpecialChar', {
//   // 当被绑定的元素插入到 DOM 中时……
//   update: function (el, { value, modifiers }, vnode) {
//     try {
//       //此处可以debug看看el具体值是什么,这里演示的是原生控件input,如果是使用element中的<el-input />标签,需要通过 el.children[0] 拿到原生input.
//       if (!el.children[0].value) {
//         return false;
//       }
//       el.children[0].value = el.children[0].value.replace(/[!~@#$%*&()_+\s^]/g, '');
//       console.log(el.children[0].value)
//       el.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
//     } catch (e) {
//     }
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')