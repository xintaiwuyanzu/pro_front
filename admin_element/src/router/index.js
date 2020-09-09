import VueRouter from 'vue-router'

/**
 * 内置默认的路由视图
 * @type {*[]}
 */
const routes = [
    {path: '/login', name: '登陆', component: () => import('../views/login')},
    {
        path: '/main',
        name: '主页面',
        component: () => import('../views/main'),
        children: [{
            path: '/main/frame',
            name: 'frame',
            component: () => import('../views/frame')
        }]
    },
    {path: '*', redirect: '/login'}
]
/**
 *
 * @param vue
 * @param ops
 */
const install = (vue, ops) => {
    vue.use(VueRouter, ops)
}
/**
 * 辅助工具类
 * 用来懒加载路由控制器
 */
const lazyRouterUtil = (name, root = '@/views/') => {
    return () => import(`${root}${name}`)
}

/**
 * 根据参数构造路由对象
 * @returns {VueRouter}
 */
const newRouter = () => {
    const route = routes;
    return new VueRouter({routes: route})
}

const exports = {routes, lazyRouterUtil, newRouter}

export default {install, exports}
