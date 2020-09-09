import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import myPlguin from './util/myPlguin'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/normal.css'
import jwebV from 'jwebv'

Vue.use(jwebV)
Vue.config.productionTip = process.env.NODE_ENV == 'development'
Vue.config.devtools = process.env.NODE_ENV == 'development'
Vue.use(ElementUI, {size: 'small', zIndex: 3000})
Vue.use(myPlguin, {router, store})
router.beforeEach((to, from, next) => {
    if (to.path != '/login' && to.path != '/index') {
        if (sessionStorage.getItem('uv')) {
            if (!store.state.user.id) {
                store.commit('login', JSON.parse(sessionStorage.getItem('uv')))
            }
            next()
        } else {
            next({path: "/login", query: {p: to.fullPath}})
        }
    } else {
        next()
    }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
