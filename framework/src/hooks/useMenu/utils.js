import hashObject from "object-hash";

/**
 * 从配置菜单中提取路径加名称
 * @param menus
 * @param obj
 * @return {*}
 */
export const pathName = (menus, obj) => {
    menus.forEach(m => {
        const data = m.data
        if (data && data.url) {
            obj[data.url] = {id: m.id, label: m.label}
        }
        if (m.children) {
            pathName(m.children, obj)
        }
    })
    return obj
}

/**
 * 缩短url
 * @param path
 * @return {string|*}
 */
export function trimUrl(path) {
    if (path) {
        if (path.endsWith('/')) {
            return path.substr(0, path.length - 1)
        } else {
            return path
        }
    }
}

/**
 * 路由类型，当作枚举常量类型
 * @type {Readonly<{ROUTE: symbol, TAB: symbol, BACK: symbol, NONE: symbol}>}
 */
export const RouteTYPE = Object.freeze({
    TAB: Symbol('tab'),
    BACK: Symbol('back'),
    NONE: Symbol('none')
})
/**
 * 根据tab生成Id
 * @param tab
 */
export const tabId = tab => {
    hashObject(tab)
    return trimUrl(tab.path)
}