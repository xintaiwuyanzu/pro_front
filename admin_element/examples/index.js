import Vue from 'vue'
import plugin from '../src/plugins'

/**
 * 构造router对象
 */
const router = plugin.newRouter();
Vue.use(plugin, {router})
window.aa = plugin.mount()
