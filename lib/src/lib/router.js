import VueRouter from 'vue-router'

const router = ({vue}) => {
    //借助plugin在这里插入组件
    //inject components here
    vue.use(VueRouter)
    const routes = [
        {path: '/', redirect: '/login'},
        {path: '/login', component: vue.component('login')},
        {
            path: '/main', component: vue.component('indexmain'),
            children: [
                //借助plugin动态插入router
                //inject router here
            ]
        }
    ]
    return new VueRouter({base: process.env.BASE_URL, routes})
}
export default {
    router
}
