import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import modules from './modules'
import getters from './getters'
import {dev} from "@dr/lib";

Vue.use(Vuex)
let plugins = []
if (dev) {
    plugins.push(createLogger())
}
/**
 * 全局状态对象
 */
export default new Vuex.Store({
    strict: dev,
    modules,
    getters,
    state,
    mutations,
    actions,
    plugins
})
