import util from '../components/login/util'

/**
 * 拦截所有的跳转，如果未登录，则跳转登录页面
 * @param vue
 * @param router
 */
export default (vue, {router}) => {
    router.beforeEach((to, from, next) => {
        if (to.matched.length === 0) {
            next({path: "/main/nofond", query: {p: to.fullPath}})
        } else if (to.path != '/login') {
            if (util.getToken()) {
                next()
            } else {
                next({path: "/login", query: {p: to.fullPath}})
            }
        } else {
            next()
        }
    })
}
