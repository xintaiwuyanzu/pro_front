//工具包
import lib from './src/lib'
//ui相关方法
import './src/styles/index.scss'

/**
 * 启动方法
 * @param opt 启动参数
 * @param callBack 启动回调
 */
const start = (opt, callBack = ops => ops) => {
    const {vue} = opt
    if (!vue) {
        throw new Error(`请传入vue对象`)
    }
    /**
     *安装工具方法
     */
    lib.install(vue, opt)
    //router
    const router = lib.router(opt)
    //store
    const store = lib.store(opt)
    const ops = {router, store, el: "#app"}
    //这里插入自定义的plugins
    //inject plugins here

    //执行回调方法，并且挂载在app元素上
    Promise.resolve(callBack(ops))
        .then(ops => new vue({...ops, render: h => h(vue.component('app'))}))
}
export default {
    ...lib,
    start
}
