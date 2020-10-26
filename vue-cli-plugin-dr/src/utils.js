const path = require('path')
const makeArray = (arr) => {
    if (arr) {
        if (Array.isArray(arr)) {
            return arr
        } else {
            return [arr]
        }
    } else {
        return []
    }
}
/**
 * 用来过滤使用哪个模块的组件
 */
const defaultSelector = (type, name, arr) => {
    return arr.sort((a, b) => a.index - b.index)[0]
}

/**
 * 从pluginOptions读取配置信息并且传给 autoCodePlugin
 * 用来判断自动加载哪些页面
 *
 * @param service
 * @param options
 * @returns {{libs: *, views: *}}
 */
const parseOptions = ({service}, options) => {
    let drOpt = options.pluginOptions ? options.pluginOptions.dr : {}
    const {pkg, context} = service
    //router　视图　　库文件
    let {views, libs, selector, limit} = drOpt
    views = makeArray(views)
    if (libs) {
        if (libs.length === 0) {
            libs = [{name: '@dr/auto', index: 0}]
        } else {
            libs = libs.map((name, index) => {
                return {name, index}
            })
        }
    } else {
        libs = makeArray(libs)
        if (libs.length === 0) {
            libs = Object.keys(pkg.dependencies)
                .map(p => require(path.resolve(process.cwd(), "node_modules", `${p}/package.json`)))
                .filter(p => p.dlib)
                .map((pkg, index) => {
                    return {name: pkg.name, index}
                })
        }
    }
    if (!selector) {
        selector = defaultSelector
    }
    limit = Object.assign({
        maxChunks: 100,
        minChunkSize: 5120
    },)
    return {views, libs, selector, limit}
}
module.exports = {
    parseOptions,
    defaultSelector
}
