import utils from "@dr/auto/lib/utils";

const isPromise = (v) => {
    return v instanceof Promise || typeof v.then === 'function'
}

/**
 * 全局变量
 * @type {{}}
 */
const moduleMap = {}

/**
 * 全局注册模块
 * @param modulePath 模块空间
 * @param moduleName 模块名称
 * @param module 模块对象
 */
export function register(modulePath, moduleName, module) {
    //先从全局对象获取子模块对象
    const pathObject = moduleMap[modulePath] = moduleMap[modulePath] || {}
    if (module) {
        const component = isPromise(module) ? utils.makeSync(module) : module
        pathObject[moduleName] = {
            name: moduleName,
            component
        }
    } else {
        const component = isPromise(moduleName.component) ? utils.makeSync(moduleName.component) : moduleName.component
        pathObject[moduleName.name] = {
            ...moduleName,
            component
        }
    }
}

/**
 * 使用模块
 * @param modulePath 模块空间
 * @param moduleName 模块名称
 */
export function useModule(modulePath, moduleName) {
    if (moduleMap[modulePath]) {
        return moduleMap[modulePath][moduleName]
    }
    return null
}

/**
 * 使用某一个空间所有的模块
 * @param modulePath 模块路径
 * @param filter 过滤函数
 * @returns {unknown[]}
 */
export function useModules(modulePath, filter) {
    const result = moduleMap[modulePath] || {}
    if (filter && result) {
        return Object.values(result).filter(filter)
    } else {
        return Object.values(result)
    }
}

/**
 * TODO 这部分需要联合后台获取权限模块处理，
 * 还没想好怎么处理动态参数
 * 使用带有权限的指定空间的所有模块
 * @param modulesPath 模块路径
 * @param filter 过滤函数
 * @returns {Promise<*[]>}
 */
export function usePermissionModules(modulesPath, filter) {
    return Promise.resolve(useModules(modulesPath, filter))
}