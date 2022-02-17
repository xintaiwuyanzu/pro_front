import {provide, reactive, watch} from "vue-demi/lib";
import {useRouter} from "@u3u/vue-hooks";
import qs from "qs";
import {MENU_KEY} from "./index";
import {http} from "../../plugins/http";
import {onMounted} from "vue-demi";

/**
 * 默认菜单加载
 */
export const defaultMenuLoader = async (sysId) => {
    const httpInstance = http();
    return httpInstance.post('/sysmenu/menutree', {sysId})
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

/*eslint-disable-next-line no-unused-vars*/
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
 * @param menus
 * @returns {undefined}
 */

/*eslint-disable-next-line no-unused-vars*/
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

export const useMenuContext = (menuLoader = defaultMenuLoader) => {
    const collapse = JSON.parse(localStorage.getItem('collapse') || false)

    const providerData = reactive({
        //菜单数据
        menu: [],
        //菜单加载状态
        menuLoading: false,
        //菜单关闭状态
        collapse,
        //当前选中状态
        currentMenu: {},
        //默认选中的key
        defaultIndex: '',
        tabs: [],
        sys: {}
    })
    //有改变就写到前端缓存中
    watch(() => providerData.collapse, (v) => localStorage.setItem('collapse', v))
    const {route, router} = useRouter()
    //监听当前菜单对象，有变化则跳转路由
    watch(() => providerData.currentMenu,
        (newMenu) => {
            if (newMenu.data && newMenu.data.url) {
                //额外的请求参数
                let query = newMenu.data.params
                if (query) {
                    //如果有额外的请求参数
                    try {
                        query = JSON.parse(query)
                    } catch (e) {
                        /*eslint-disable-next-line*/
                    }
                    if (typeof query === 'string') {
                        query = {query}
                    }
                } else {
                    query = {}
                }
                const url = trimUrl(newMenu.data.url)
                //过滤重复跳转
                if (trimUrl(route.value.path) !== url) {
                    if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
                        router.push({
                            path: '/main/frame',
                            query: {$url: `${url}?${qs.stringify(query)}`}
                        })
                    } else {
                        router.push({path: url, query})
                    }
                }
            }
        })
    //监听系统菜单编码，重新加载菜单数据
    watch(() => providerData.sys, async () => {
        providerData.menuLoading = true
        const result = await menuLoader(providerData.sys.id)
        providerData.menu = result.data.data
        //这里强制跳转home页面
        providerData.currentMenu = {data: {url: '/home'}}
        //清空tab
        providerData.tabs = []
        /*const currentPath = trimUrl(route.value.path)
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
        }*/
        providerData.menuLoading = false
    })

    onMounted(() => {
        //这里的系统名称可以从环境变量获取
        const sysConfig = process.env.sys;
        providerData.sys = {id: sysConfig.sysCode || 'default', sysName: document.title}
    })

    provide(MENU_KEY, providerData);
    return providerData
}
