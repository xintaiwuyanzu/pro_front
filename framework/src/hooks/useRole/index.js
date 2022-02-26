import {onBeforeMount, reactive} from "vue-demi";
import {inject, provide} from "vue-demi/lib";
import {http} from "../../plugins/http";
import {useRouter} from "@u3u/vue-hooks";

const roleProviderKey = '$role'
/**
 * 角色上下文
 * @param roleLoader
 * @returns {UnwrapRef<{role: *[]}>}
 */
export const useRoleContext = (roleLoader) => {
    const role = reactive({role: []})
    provide(roleProviderKey, role)
    onBeforeMount(async () => {
        if (!roleLoader) {
            roleLoader = () => http().post('sysrole/userRole')
        }
        const {data} = await roleLoader()
        role.role = data.data
    })
    const {router} = useRouter()
    //拦截路由跳转，没有权限的跳转没权限页面
    router.beforeEach(async (to, from, next) => {
        let comp = to.matched[to.matched.length - 1]
        comp = comp.components
        if (comp.default) {
            comp = comp.default
        }
        if (typeof comp === 'function') {
            const asyncCom = await comp()
            if (asyncCom.component) {
                comp = await asyncCom.component
                if (comp.default) {
                    comp = comp.default
                }
            }
        }
        if (comp?.role) {
            if (hasRole(comp.role, role)) {
                next()
            } else {
                next({path: '/main/noAuth'})
            }
        } else {
            next()
        }
    })
    return role
}
/**
 * 提供角色数据
 * @returns {unknown}
 */
export const useRole = () => {
    return inject(roleProviderKey)
}
/**
 *工具方法
 * @param roleIdOrCode
 * @param roles
 * @returns {boolean}
 */
export const hasRole = (roleIdOrCode, roles) => {
    if (roles.role) {
        if (!Array.isArray(roleIdOrCode)) {
            roleIdOrCode = [roleIdOrCode]
        }
        for (let i in roleIdOrCode) {
            const r = roleIdOrCode[i]
            for (let j in roles.role) {
                const role = roles.role[j]
                if (role.id === r || role.code === r) {
                    return true
                }
            }
        }
    }
    return false
}