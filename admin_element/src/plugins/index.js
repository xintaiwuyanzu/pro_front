import ax from "./axios";
import utils from "./utils";
import ui from './ui'
import router from '../router'
import store from '../store'

const items = [utils, ui, ax, router, store]
/**
 * vue 插件
 * @param vue
 * @param ops
 */
const install = function (vue, ops = {}) {
    if (!install.installed) {
        items.forEach(i => vue.use(i, ops))
        //设置提示信息
        vue.config.productionTip = vue.config.devtools = utils.exports.debug
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    ...utils.exports,
    ...ui.exports,
    ...ax.exports,
    ...router.exports,
    ...store.exports,
    install
}


