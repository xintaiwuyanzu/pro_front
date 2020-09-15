import axios from 'axios'
import 'nprogress/nprogress.css'
import NProgress from "nprogress";
import qs from 'qs'

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
