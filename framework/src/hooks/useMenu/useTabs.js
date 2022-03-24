import {inject, provide, reactive, watch} from "vue-demi";
import {useRouter} from "@u3u/vue-hooks";

const tabsKey = '$tabs'
export const useTabsContext = () => {
    const tabs = reactive({
        tabs: [{path: '/home', label: '首页', query: {}, fix: true, params: {}}],
        current: '/home'
    })
    const {router, route} = useRouter()
    watch(() => tabs.current, (n) => {
        const value = tabs.tabs.find(s => s.path === n)
        if (value && route.value.path !== value.path) {
            router.push(value)
        }
    })
    provide(tabsKey, tabs)
    return {tabs}
}
export const useTabs = () => {
    const tabs = inject(tabsKey);

    const removeTab = (path) => {
        let index = tabs.tabs.findIndex(t => t.path === path)
        if (index > 0) {
            tabs.tabs.splice(index, 1)
            if (path === tabs.current) {
                if (index >= tabs.tabs.length) {
                    index = index - 1
                }
                if (index < 0) {
                    index = 0
                }
                tabs.current = tabs.tabs[index].path
            }
        }
    }
    const removeAll = () => {
        tabs.tabs.splice(1, tabs.tabs.length - 1)
        tabs.current = tabs.tabs[0].path
    }

    const removeOthers = () => {
        tabs.tabs = tabs.tabs.filter(v => v.fix || v.path === tabs.current)
    }

    const setName = (name) => {
        if (name) {
            const value = tabs.tabs.find(t => t.path === tabs.current)
            if (value) {
                value.label = name
            }
        }
    }

    return {tabs, removeTab, removeAll, removeOthers, setName}
}