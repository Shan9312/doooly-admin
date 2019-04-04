/**Vue全家桶 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')