//工具包
import plugin from './src/plugin'
//ui相关方法
import './src/styles/index.scss'

/**
 * 启动方法
 * @param opt 启动参数
 * @param callBack 启动回调
 */
const start = (opt, callBack = ops => ops) => {
    if (!opt.vue) {
        throw new Error(`请传入vue对象`)
    }
    /**
     *安装工具方法
     */
    plugin.install(opt.vue, opt)
    //router
    const router = plugin.router(opt)
    //store
    const store = plugin.store(opt)
    const ops = {router, store, el: "#app"}
    //执行回调方法，并且挂载在app元素上
    Promise.resolve(callBack(ops))
        .then(ops => new opt.vue({...ops, render: h => h(opt.vue.component('app'))}))
}
export default {
    ...plugin,
    start
}
