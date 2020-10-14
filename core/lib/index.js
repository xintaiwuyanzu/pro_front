import router from "./router";
import store from "./store";
import utils from "./utils";
import {plugins} from '@dr/auto'

/**
 * 启动方法
 * @param opt 启动参数
 * @param callBack 启动回调
 */
const start = (opt) => {
    const {vue} = opt
    if (!vue) {
        throw new Error(`请传入vue对象`)
    }
    //构造router
    const routerInstance = router.router(opt)
    //构造store
    const storeInstance = store.store(opt)
    const makePromise = plugin => Promise.resolve(plugin.value.default(vue, routerInstance, storeInstance, opt))
    //回调所有的plugin
    Promise.all(plugins.map(makePromise))
        .then(() => {
            new vue({router: routerInstance, store: storeInstance, render: h => h(vue.component('app'))})
                .$mount(opt.el ? opt.el : '#app')
        })
}
export default {
    ...utils,
    /**
     * 路由相关
     */
    ...router,
    /**
     * vuex相关
     */
    ...store,
    /**
     * 默认启动方法
     */
    start
}
