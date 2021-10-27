import {inject, onMounted, provide, reactive, watchEffect} from "vue-demi";
import {http} from "../../plugins/http";
import {useRouter} from '@u3u/vue-hooks'

/**
 * 默认菜单加载
 */
const defaultMenuLoader = async () => {
    const httpInstance = http();
    //TODO 这里参数写死了
    return httpInstance.post('/sysmenu/menutree', {sysId: 'default'})
}
/**
 * 系统菜单主键
 * @type {symbol}
 */
const MENU_KEY = Symbol('$sysMenu')
//TODO 这里先暴力的实现了
export const useMenuContext = (menuLoader = defaultMenuLoader) => {
    const providerData = reactive({
        //菜单数据
        menu: [],
        //菜单加载状态
        menuLoading: false,
        //菜单关闭状态
        collapse: false,
        //当前选中状态
        currentMenu: {},
        //默认选中的key
        defaultIndex: ''
    })
    const {route, router} = useRouter()
    //监听当前菜单对象，有变化则跳转路由
    watchEffect(() => {
        if (providerData.currentMenu && providerData.currentMenu.data) {
            if (providerData.currentMenu.data.url) {
                const url = providerData.currentMenu.data.url
                //过滤重复跳转
                if (route.value.path !== url) {
                    if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
                        router.push({name: 'frame', params: {$url: url}, query: {$url: url}})
                    } else {
                        router.push(url)
                    }
                }
            }
        }
    })

    /**
     *组件初始化的时候加载菜单
     */
    onMounted(async () => {
        providerData.menuLoading = true
        const result = await menuLoader()
        providerData.menu = result.data.data
        providerData.menuLoading = false
        if (route.value.path === '/main/') {
            let first = providerData.menu[1]
            if (first.children) {
                first = first.children[0]
            }
            if (first) {
                providerData.defaultIndex = first.id
                providerData.currentMenu = first
            }
        }
    })
    provide(MENU_KEY, providerData);
    return providerData
}
/**
 * 所有子控件都能用这个方法注入响应式菜单数据
 * @returns {{menuData: unknown}}
 */
export const useMenu = () => {
    const menu = inject(MENU_KEY)
    return {menuData: menu}
}