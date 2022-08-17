import router from "./router";
import store from "./store";
import utils from "./utils";
import {plugins} from '@dr/auto'

let routerInstance
let storeInstance
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
    routerInstance = router.router(opt)
    //构造store
    storeInstance = store.store(opt)
    const makePromise = plugin => Promise.resolve(plugin.value.default(vue, routerInstance, storeInstance, opt))
    //回调所有的plugin
    Promise.all(plugins.map(makePromise))
        .then(() => {
            let componentName = 'app'
            if (utils.dev && opt.componentName) {
                //如果是开发环境，可以直接传componentName参数，直接渲染页面
                componentName = opt.componentName
            }
            new vue({
                    router: routerInstance,
                    store: storeInstance,
                    render: h => h(vue.component(componentName))
                }
            ).$mount(opt.el ? opt.el : '#app')
        })
}

export const setRouterInstance = (ins) => {
    routerInstance = ins
}
export const setStoreInstance = (ins) => {
    storeInstance = ins
}

export const useRouter = () => {
    return {router: routerInstance}
}

export const useStore = () => storeInstance

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
