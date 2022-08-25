import {computed, onMounted, provide, reactive, watch} from "vue";
import {pathName, RouteTYPE, tabId, trimUrl} from "./utils";
import {MENU_KEY} from "./index";
import {http} from "../../plugins/http";
import {useRouter} from "@dr/auto/lib";
import qs from "qs";
import {Message} from "element-ui";

/**
 * 是否拦截了路由
 * @type {boolean}
 */
let routerModified = false
/**
 * 默认菜单加载
 */
export const defaultMenuLoader = (sysId) => http().post('/sysmenu/menutree', {sysId})
export const defaultSysIdLoader = () => ({id: 'default', sysName: document.title})
export const useMenuContext = (menuLoader = defaultMenuLoader, sysLoader = defaultSysIdLoader) => {
    const collapse = JSON.parse(localStorage.getItem('collapse') || false)
    const homeTab = {label: '首页', id: '/home', path: '/home', fix: true}
    const menu = reactive({
        //菜单数据
        menu: [],
        //菜单加载状态
        menuLoading: false,
        //菜单关闭状态
        collapse,
        //当前选中状态
        currentMenu: {},
        //动态计算路径的中文名称
        pathName: computed(() => pathName(menu.menu, {})),
        sys: {},
        //所有的tab组件
        tabs: [homeTab],
        //当前选中的tab组件
        currentTab: homeTab
    })
    const {router} = useRouter()

    //有改变就写到前端缓存中
    watch(() => menu.collapse, (v) => localStorage.setItem('collapse', v))
    //监听系统菜单编码，重新加载菜单数据
    watch(() => menu.sys.id, async () => {
        menu.menuLoading = true
        const sysInfo = await http().post('/subsys/detail', {id: menu.sys.id})
        if (sysInfo.data.success) {
            menu.sys = sysInfo.data.data
            const title = menu.sys.sysName || menu.sys.shortName
            document.title = title
        }
        const {data} = await menuLoader(menu.sys.id)
        if (data.success) {
            menu.menu = data.data
            menu.tabs.splice(0, menu.tabs.length)
            menu.tabs.push(homeTab)
            //这里强制跳转home页面
            routeByTab(homeTab)
        } else {
            menu.menu = []
            menu.tabs.splice(0, menu.tabs.length)
            Message.warning('加载菜单失败：' + data.message)
        }
        menu.menuLoading = false
    })

    onMounted(async () => {
        menu.sys = await sysLoader()
    })
    provide(MENU_KEY, menu);

    let routeType = RouteTYPE.NONE
    /**
     * 菜单路由方法
     * @param menu
     */
    const routeByMenu = (item) => {
        if (item.data && item.data.url) {
            const url = trimUrl(item.data.url)
            //过滤重复跳转
            if (trimUrl(router.currentRoute.path) === url) {
                return
            }
            //额外的请求参数
            let query = item.data.params
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
            const params = {
                $label: item.label,
                $id: item.id
            }
            menu.currentMenu = item

            let tab = menu.tabs.find(m => m.id === item.id)
            if (!tab) {
                tab = {
                    id: item.id,
                    label: item.label,
                    query,
                    name: url,
                    path: url,
                    params
                }
                if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
                    tab.name = '/main/frame'
                    tab.query = {$url: `${url}?${qs.stringify(query)}`}
                }
                menu.tabs.push(tab)
            }
            menu.currentTab = tab
        }
    }
    /**
     * tab 路由方法
     * @param tab
     */
    const routeByTab = (tab) => {
        if (routeType === RouteTYPE.ROUTE || routeType === RouteTYPE.BACK) {
            //代码路由，路由完成后，恢复NONE
            routeType = RouteTYPE.NONE
        } else {
            //点击tab切换路由
            routeType = RouteTYPE.TAB
            if (trimUrl(router.currentRoute.path) !== trimUrl(tab.path)) {
                router.push(tab)
            }
        }
        if (tab.id !== menu.currentMenu.id) {
            menu.currentMenu = {id: tab.id, label: tab.label}
        }
    }
    //拦截修改router
    if (!routerModified) {
        const originBack = router.back
        //拦截返回方法
        router.back = () => {
            routeType = RouteTYPE.BACK
            originBack.call(router)
        }
        //拦截之前
        router.beforeEach((to, from, next) => {
            if (to.path === '/login') {
                //这个跳到登录页面了，不知道需不需要清空缓存
                menu.tabs.splice(0, menu.tabs.length)
                next()
                return
            }
            if (routeType === RouteTYPE.NONE) {
                const tab = {query: to.query, name: to.name, path: to.path, params: to.params}
                //根据路径获取菜单信息
                const pathMenu = menu.pathName[tab.path]
                if (pathMenu) {
                    tab.label = pathMenu.label
                    tab.id = pathMenu.id
                } else {
                    tab.label = menu.currentTab.label
                    tab.id = tabId(tab)
                }
                const oldTab = menu.tabs.find(t => t.id === tab.id)
                if (oldTab) {
                    oldTab.query = tab.query
                    oldTab.params = tab.params
                    menu.currentTab = oldTab
                } else {
                    menu.currentTab = tab
                    menu.tabs.push(tab)
                }
                routeType = RouteTYPE.ROUTE
            } else if (routeType === RouteTYPE.TAB) {
                routeType = RouteTYPE.NONE
            } else if (routeType === RouteTYPE.BACK) {
                const toTab = menu.tabs.find(t => t.path === to.path)
                if (toTab) {
                    menu.tabs.splice(menu.tabs.indexOf(menu.currentTab), 1)
                    menu.currentTab = toTab
                }
            }
            next()
        })
        routerModified = true
    }
    //监听菜单
    watch(() => menu.currentMenu, routeByMenu)
    watch(() => menu.currentTab, routeByTab)
    return {menu, routeByMenu, routeByTab}
}
