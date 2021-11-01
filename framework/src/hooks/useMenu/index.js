import {inject, onMounted, provide, reactive, unref, watch} from "vue-demi";
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

function trimUrl(path) {
    if (path) {
        if (path.endsWith('/')) {
            return path.substr(0, path.length - 1)
        } else {
            return path
        }
    }
}

function filterMenu(arr, path) {
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const a = arr[i]
            if (a.data && trimUrl(a.data.url) === path) {
                return a
            } else if (a.children) {
                const childResult = filterMenu(a.children, path)
                if (childResult) {
                    return childResult
                }
            }
        }
    }
}

/**
 * 查找第一个菜单
 * @param menu
 * @returns {undefined}
 */
function findFirstMenu(menus) {
    if (menus) {
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i]
            if (menu.data && menu.data.url) {
                return menu
            } else if (menu.children) {
                const result = findFirstMenu(menu.children)
                if (result) {
                    return result
                }
            }
        }
    }
    return undefined;
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
    watch(() => providerData.currentMenu,
        (newMenu) => {
            if (newMenu.data && newMenu.data.url) {
                const url = trimUrl(newMenu.data.url)
                //过滤重复跳转
                if (trimUrl(route.value.path) !== url) {
                    if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
                        router.push({name: 'frame', params: {$url: url}, query: {$url: url}})
                    } else {
                        router.push(url)
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
        const currentPath = trimUrl(route.value.path)
        if (currentPath === '/main') {
            const first = findFirstMenu(providerData.menu)
            if (first) {
                providerData.defaultIndex = first.id
                providerData.currentMenu = unref(first)
            }
        } else {
            const currentMenu = filterMenu(providerData.menu, currentPath)
            if (currentMenu) {
                providerData.currentMenu = currentMenu
            }
        }
        providerData.menuLoading = true
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