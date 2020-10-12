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
    let {views, libs, selector} = drOpt
    views = makeArray(views)
    if (libs) {
        if (libs.length === 0) {
            libs = [{name: '@dr/lib', index: 0}]
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
    return {views, libs, selector}
}

const fs = require('graceful-fs')
const path = require('path')
const reader = require('./reader')
const writeJson = require('write-json-file')

const readLibAndCache = (cacheDir, libs, selector) => {
    const result = {}
    const data = reader.readLib(libs)
    //使用selecter 过滤数据
    Object.keys(data)
        .forEach(type => {
            result[type] = {}
            Object.entries(data[type])
                .forEach(([name, arr]) => {
                    let v = selector(type, name, arr)
                    if (!v) {
                        v = defaultSelector(type, name, arr)
                    }
                    result[type] [name] = v
                })
            writeJson.sync(path.resolve(cacheDir, `${type}.json`), result[type])
        })
    return result
}

/**
 * 根据配置动态生成代码
 * @param api
 * @param options
 */
module.exports = (api, options) => {
    const {views, libs, selector} = parseOptions(api, options)
    //计算缓存文件夹和环境hash
    const {cacheDirectory, cacheIdentifier} = api.genCacheConfig('pluginDr', {}, ['vue.config.js'])
    //先判断缓存是否存在
    const cacheDir = path.resolve(cacheDirectory, cacheIdentifier)

    //依赖包数据
    let libData = {}
    if (fs.existsSync(cacheDir)) {
        //缓存存在，则读取缓存数据
        const files = fs.readdirSync(cacheDir)
        if (files.length === reader.count) {
            files.forEach(file => {
                const {name} = path.parse(file)
                libData[name] = require(path.resolve(cacheDir, file))
            })
        } else {
            fs.rmdirSync(cacheDir, {recursive: true})
            fs.mkdirSync(cacheDir, {recursive: true})
            libData = readLibAndCache(cacheDir, libs, selector)
        }
    } else {
        //缓存不存在，创建文件夹
        fs.mkdirSync(cacheDir, {recursive: true})
        //如果缓存不存在，则重新计算
        libData = readLibAndCache(cacheDir, libs, selector)
    }
    //项目数据
    const prjData = reader.readPrj(views)
    //合并所有数据，生成指定的文件
    Object.keys(libData).forEach(key => {
        const data = Object.assign({}, libData[key], prjData[key])
        const filePath = path.resolve(cacheDirectory, `${key}.js`)
        //生成js文件
        fs.writeFileSync(filePath, reader.render(key, data))
    })
}
