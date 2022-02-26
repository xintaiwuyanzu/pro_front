import util from '../components/login/util'
import {Message} from "element-ui";
import {hasRole} from "../hooks/useRole";

/**
 * 拦截所有的跳转，如果未登录，则跳转登录页面
 * @param vue
 * @param router
 */
export default (vue, router) => {
    router.beforeEach((to, from, next) => {
        if (to.path === from.path) {
            Message.warning('重复跳转！')
            next(false)
        } else {
            if (to.matched.length === 0) {
                const noFondPath = '/main/nofond'
                if (from.path === noFondPath) {
                    Message.warning('重复跳转！')
                    next(false)
                } else {
                    next({path: noFondPath, query: {p: from.fullPath}})
                }
            } else if (to.path !== '/login') {
                if (util.getToken()) {
                    next()
                } else {
                    next({path: "/login", query: {p: to.fullPath}})
                }
            } else {
                next()
            }
        }
    })

    vue.mixin({
        inject: {
            $role: {
                default() {
                    return []
                }
            },
            $sysMenu: {
                default() {
                    return {
                        sys: {}
                    }
                }
            }
        },
        methods: {
            hasRole(roleIdOrCode) {
                return hasRole(roleIdOrCode, this.$role)
            },
            isSys(sysId) {
                return this.$sysMenu.sys.id === sysId
            }
        },
    })
}
