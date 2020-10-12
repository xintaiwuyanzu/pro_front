import VueRouter from 'vue-router'
import {components, views} from 'vue-cli-plugin-dr'

const router = ({vue}) => {
    components.forEach(c => {
        vue.component(c.name, c.component)
    })
    vue.use(VueRouter)
    const routes = [
        {path: '/', redirect: '/login'},
        {path: '/login', component: vue.component('login')},
        {
            path: '/main', component: vue.component('indexmain'),
            children: views
        }
    ]
    return new VueRouter({base: process.env.BASE_URL, routes})
}
export default {
    router
}
