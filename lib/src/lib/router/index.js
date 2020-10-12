import VueRouter from 'vue-router'
import {components, views} from 'vue-cli-plugin-dr'
import error from './error'
import loading from './loading'

const makeSync = (component) => {
    return () => ({
        component,
        error,
        loading
    })
}
const router = ({vue}) => {
    components.forEach(({name, component}) => vue.component(name, makeSync(component)))
    vue.use(VueRouter)
    const routes = [
        {path: '/', redirect: '/login'},
        {path: '/login', component: vue.component('login')},
        {
            path: '/main', component: vue.component('indexmain'),
            children:
                views.map(({path, component}) => ({
                    path, component: makeSync(component)
                }))
        }
    ]
    return new VueRouter({base: process.env.BASE_URL, routes})
}
export default {
    router
}
