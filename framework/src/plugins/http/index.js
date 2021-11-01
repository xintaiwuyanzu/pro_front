import axios from 'axios'
import NProgress from "nprogress";
//TODO 这里应该也一起跟着样式走
import qs from 'qs'
import util from '../../components/login/util'
import {Message} from "element-ui";
import './style.scss'
/**
 * 默认配置项
 */
const defaultCfg = {
    baseURL: '/api', timeout: 5000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest(data) {
        NProgress.start()
        return qs.stringify(data)
    },
    transformResponse(data) {
        NProgress.done()
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {success: false, message: '数据格式不正确'}
        }
        return data
    }
}
let httpInstance;

/**
 * 初始化默认http客户端
 * @param base
 * @returns {AxiosInstance}
 */
export function initHttp(cfg = defaultCfg) {
    httpInstance = axios.create(cfg)
    return httpInstance;
}

/**
 * 获取默认的http客户端
 * @returns {*}
 */
export function http() {
    if (!httpInstance) {
        initHttp()
    }
    return httpInstance;
}

/**
 * 这里会被扫描到，用来初始化http请求
 * @param vue
 * @param router
 */
export default (vue, router, store) => {
    const instance = http()
    //拦截所有的请求，添加token
    instance.interceptors.request.use(config => {
        const header = config.headers
        header['$token'] = header['dauth'] = util.getToken()
        return config;
    }, err => {
        return Promise.reject(err);
    })
    instance.interceptors.response.use(
        response => {
            if (response.data.message === 'needLogin') {
                router.replace({path: 'login', query: {redirect: router.currentRoute.fullPath}})
            } else {
                return response
            }
        },
        err => {
            //routeLogin(options)
            let message = `服务器错误【${err}】`
            if (err && err.message.startsWith('timeout')) {
                message = `网络请求超时，请稍候重试！`
            }
            Message.error(message)
            return Promise.resolve({data: {success: false, message}})
        })
    store.$http = vue.prototype.$http = instance
    store.$post = vue.prototype.$post = instance.post
    store.$get = vue.prototype.$get = instance.get
    store.$router = router

    //拦截跳转，添加加载进度
    router.beforeEach((route, redirect, next) => {
        NProgress.start()
        next()
    })
    router.afterEach(() => {
        NProgress.done()
    })
}
