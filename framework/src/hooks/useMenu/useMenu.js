import {inject} from "vue-demi/lib";
import {MENU_KEY} from "./index";

/**
 * 所有子控件都能用这个方法注入响应式菜单数据
 * @returns {{menuData: unknown}}
 */
export const useMenu = () => {
    const menu = inject(MENU_KEY)
    /**
     * 关闭指定的tab
     * @param id
     */
    const removeTab = (id) => {
        let index = menu.tabs.findIndex(t => t.id === id)
        if (index > 0) {
            menu.tabs.splice(index, 1)
            if (id === menu.currentTab.id) {
                if (index >= menu.tabs.length) {
                    index = index - 1
                }
                if (index < 0) {
                    index = 0
                }
                menu.currentTab = menu.tabs[index]
            }
        }
    }
    /**
     * 关闭所有的tab
     */
    const removeAll = () => {
        menu.tabs.splice(1, menu.menu.length - 1)
        menu.currentTab = menu.tabs[0]
    }

    /**
     * 关闭其他tab
     */
    const removeOthers = () => {
        menu.tabs = menu.tabs.filter(v => v.fix || v.id === menu.currentTab.id)
    }
    /**
     * 设置当前tab的名称
     * @param name
     */
    const setName = (name) => {
        if (name) {
            menu.currentTab.label = name
        }
    }
    return {
        menuData: menu,
        removeTab,
        removeAll,
        removeOthers,
        setName
    }
}