import {frame, login, main} from "../ui";
import fs from 'fs'
import path from 'path'
import vue from 'vue'
import VueRouter from 'vue-router'

/**
 *根据路径查找项目是否有指定的组件，如果有
 * @param name
 * @param dft
 * @returns {(function(): *)|*}
 */
const resoleOrDefault = (name, dft) => {
    const cmtPath = path.join(__dirname, 'src', 'views', `${name}.vue`)
    if (fs.existsSync(cmtPath)) {
        return () => import(cmtPath)
    } else {
        return dft
    }
}
/**
 * 获取孩子对象
 */
const resolveChildren = () => {
    const frame = {path: '/main/frame', name: 'frame', component: () => resoleOrDefault('frame', frame)}
    let children = require.context('@/views/', true, /index\.vue$/, 'lazy')
        .keys()
        .map(k => {
            let trueKey = k.replace('.', '').replace('/index.vue', '')
            return {
                path: trueKey,
                component: () => import(/* webpackChunkName: "[request]" */ `@/views${trueKey}`)
            }
        })
    return [frame, ...children]
}

/**
 *获取所有路由对象
 */
export function resolveRouters() {
    return {
        base: process.env.BASE_URL,
        routes: [
            {path: '/login', name: '登陆', component: resoleOrDefault('login', login)},
            {
                path: '/main', name: '主页面', children: resolveChildren(),
                component: () => resoleOrDefault('main', main)
            },
            {path: '*', redirect: '/login'}
        ]
    }
}

/**
 * 初始化router对象，返回对象
 * @param routerOptions
 * @returns {VueRouter}
 */
export function initRouters(routerOptions = resolveRouters()) {
    vue.use(VueRouter)
    return new VueRouter(routerOptions)
}
