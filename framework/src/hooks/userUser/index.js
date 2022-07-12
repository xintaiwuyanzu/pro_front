import {inject, provide, onMounted, reactive} from "vue";
import {http} from "../../plugins/http";

const userProviderKey = '$user'

/**
 * 全局登录用户上下文
 * @param userLoader
 * @returns {UnwrapRef<{user: {id: string}}>}
 */
export const useUserContext = (userLoader) => {
    //当前登录用户
    const user = reactive({user: {id: ''}})
    if (!userLoader) {
        userLoader = async () => {
            return http().post('/login/info')
        }
    }
    //程序启动加载登录用户信息
    onMounted(async () => {
        const {data} = await userLoader()
        user.user = data.data
    })

    provide(userProviderKey, user)
    return user
}

/**
 * 全局提供当前登录用户信息
 * @returns {unknown}
 */
export const useUser = () => {
    return inject(userProviderKey)
}