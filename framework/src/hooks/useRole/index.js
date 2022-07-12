import {reactive, inject, provide} from "vue";
import {http} from "../../plugins/http";
import {useRouter} from "@dr/auto/lib";

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

const roleProviderKey = '$role'

let isRouterModify = false
/**
 * 角色上下文
 * @param roleLoader
 * @return {UnwrapRef<{role: *[]}>}
 */
export const useRoleContext = async (roleLoader) => {
    const role = reactive({role: []})
    provide(roleProviderKey, role)
    const loadRole = async () => {
        if (!roleLoader) {
            roleLoader = () => http().post('sysrole/userRole')
        }
        const {data} = await roleLoader()
        if (data.success) {
            role.role = data.data
        } else {
            role.role = []
        }
    }
    await loadRole()
    const {router} = useRouter()
    if (!isRouterModify) {
        router.beforeResolve(async (to, from, next) => {
            //所有子组件的刷新在此拦截
            let comp = to.matched[to.matched.length - 1]
            comp = comp.components
            if (comp.default) {
                comp = comp.default
            }
            if (comp && comp.role) {
                if (hasRole(comp.role, role)) {
                    next()
                } else {
                    next({path: '/main/noAuth', replace: true})
                }
            } else {
                next()
            }
        })
        isRouterModify = true
    }
    return role
}
/**
 * 提供角色数据
 * @returns {unknown}
 */
export const useRole = () => {
    return inject(roleProviderKey)
}
