import {inject} from "vue-demi/lib";
import {MENU_KEY} from "./index";

/**
 * 所有子控件都能用这个方法注入响应式菜单数据
 * @returns {{menuData: unknown}}
 */
export const useMenu = () => {
    const menu = inject(MENU_KEY)
    /**
     * 添加tab
     * @param tab
     */
    const addTab = tab => {
        let old = menu.tabs.find(m => m.id === tab.id)
        if (!old) {
            old = tab
            menu.tabs.push(old)
        }
        menu.currentMenu = tab
    }
    /**
     * 删除tab
     * @param id
     */
    const removeTab = id => {
        let index = -1
        menu.tabs = menu.tabs.filter((t, i) => {
            if (t.id === id) {
                index = i
                return false
            }
            return true
        })
        if (id === menu.currentMenu.id) {
            if (index === menu.tabs.length) {
                index--
            }
            if (index >= 0) {
                menu.currentMenu = menu.tabs[index]
            }
        }
    }
    /**
     * 清空所有tab
     */
    const clearTab = (useCurrent) => {
        if (useCurrent) {
            menu.tabs = menu.tabs.filter(t => t.id === menu.currentMenu.id)
        } else {
            menu.tabs.splice(0, menu.tabs.length)
        }
    }
    /**
     *切换tab
     * @param id
     */
    const activeTab = (id) => {
        const tab = menu.tabs.find(m => m.id === id)
        if (tab) {
            menu.currentMenu = tab
        } else if (id === '/home') {
            menu.currentMenu = {data: {url: '/home'}}
        }
    }

    return {
        menuData: menu,
        addTab,
        removeTab,
        activeTab,
        clearTab
    }
}