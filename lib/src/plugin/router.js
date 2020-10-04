import VueRouter from 'vue-router'
import NProgress from 'nprogress'

const router = ({vue}) => {
    //借助plugin在这里插入组件
    //inject components here
    vue.use(VueRouter)
    const routes = [
        {path: '/login', component: vue.component('login')},
        {
            path: '/main', component: vue.component('indexmain'),
            children: [
                //借助plugin动态插入router
                //inject router here
            ]
        },
        {path: '*', redirect: '/login'}
    ]
    const router = new VueRouter({base: process.env.BASE_URL, routes})
    //拦截跳转，添加加载进度
    router.beforeEach((route, redirect, next) => {
        NProgress.start()
        next()
    })
    router.afterEach(() => {
        NProgress.done()
    })
    return router
}
export default {
    router
}
