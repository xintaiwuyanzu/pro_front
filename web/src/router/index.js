import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let children = require.context('../views/', true, /index\.vue$/, 'lazy')
    .keys()
    .map(k => {
        let trueKey = k.replace('.', '').replace('/index.vue', '')
        return {
            path: trueKey,
            component: () => import(/* webpackChunkName: "[request]" */ `@/views${trueKey}`)
        }
    })
export default new Router({
    base: process.env.BASE_URL,
    routes: [
        {path: '/login', name: '登陆', component: () => import('@/views/login')},
        {
            path: '/main',
            name: '主页面',
            component: () => import('../views/main'),
            children: [{
                path: '/main/frame',
                name: 'frame',
                component: () => import('../views/frame')
            }, ...children]
        },
        {path: '*', redirect: '/login'}
    ]
})
