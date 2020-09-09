import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import modules from './modules'
import getters from './getters'

Vue.use(Vuex)
let debug = process.env.NODE_ENV !== 'production'
let plugins = []
if (debug) {
  plugins.push(createLogger())
}
/**
 * 全局状态对象
 */
export default new Vuex.Store({
  strict: debug,
  modules,
  getters,
  state,
  mutations,
  actions,
  plugins
})
