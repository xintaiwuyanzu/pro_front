import {onBeforeUnmount, onUpdated, watch} from "vue";
import {trimUrl} from "../../hooks/useMenu/utils";
import {useMenu} from "../../hooks/useMenu";
import {useRouter} from "@dr/auto/lib";

function isAsyncPlaceholder(node) {
    return node.isComment && node.asyncFactory
}

function isDef(v) {
    return v !== undefined && v !== null
}

function getFirstComponentChild(children) {
    if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const c = children[i]
            if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                return c
            }
        }
    }
}

/**
 * 根据vNode获取名称
 * @param vNode
 * @return {*}
 */
const getNodeKey = vNode => {
    const componentOptions = vNode && vNode.componentOptions
    return componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
}


export default {
    name: 'route-alive',
    setup(prop, {slots}) {
        const {menuData} = useMenu()
        //缓存对象
        const caches = {}
        const cacheKey = {}
        let vNodeToCache = undefined
        const destroyVm = k => {
            const value = caches[k]
            if (value && value.$destroy) {
                value.$destroy()
            }
            delete caches[k]
            delete cacheKey[k]
        }
        //监听tabs数据，动态销毁实例
        watch(menuData.tabs, (n) => {
            const ids = n.map(t => t.path)
            Object.keys(caches)
                .forEach(k => {
                    if (!ids.includes(k)) {
                        destroyVm(k)
                    }
                })
        })

        const {router} = useRouter()
        //延迟缓存vNode对象
        const cacheNode = () => {
            if (vNodeToCache) {
                const ids = menuData.tabs.map(t => t.path)
                const path = trimUrl(router.currentRoute.path)
                if (ids.includes(path)) {
                    caches[path] = vNodeToCache.componentInstance
                    const key = getNodeKey(vNodeToCache)
                    cacheKey[path] = key
                }
                vNodeToCache = null
            }
        }
        onUpdated(cacheNode)
        onBeforeUnmount(() => Object.keys(caches).forEach(destroyVm))
        return () => {
            if (slots.default) {
                const vNode = getFirstComponentChild(slots.default())
                const key = getNodeKey(vNode)
                const path = trimUrl(router.currentRoute.path)
                if (path === menuData.currentTab.path && cacheKey[path] === key && caches[path]) {
                    vNode.componentInstance = caches[path]
                } else {
                    vNodeToCache = vNode
                }
                vNode.data.keepAlive = true
                return vNode
            }
        }
    }
}