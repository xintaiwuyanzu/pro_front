import VueRouter from 'vue-router'
import {components, views} from '@dr/auto'
import utils from './utils'

const router = ({vue}) => {
    components.forEach(({name, component}) => vue.component(name, utils.makeSync(component)))
    vue.use(VueRouter)
    const routes = [
        {path: '/', redirect: '/login'},
        {path: '/login', component: vue.component('login')},
        {
            path: '/main', component: vue.component('indexmain'),
            children:
                views.map(({path, component}) => ({
                    path, component: utils.makeSync(component)
                }))
        }
    ]
    return new VueRouter({base: process.env.BASE_URL, routes})
}
export default {
    router
}
