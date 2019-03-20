import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'

export default new Vuex.Store({
  getters,
  modules: {
    app,
    user,
    permission,
    tagsView
  }
})