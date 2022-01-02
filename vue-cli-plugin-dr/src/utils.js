const path = require('path')
const readPkg = require('read-pkg')
const readOrCreate = (obj, key) => {
    let value = obj[key]
    if (!value) {
        value = {}
        obj[key] = value
    }
    return value
}

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
 * 根据package.json读取所有依赖的dlib
 */
const readLibs = (pkg, arr, rootIndex = 0, libNameArr) => {
    if (pkg && pkg.dependencies) {
        Object.keys(pkg.dependencies)
            .map(p => readPkg.sync({cwd: moduleDir(p)}))
            .filter(p => p.dlib)
            .forEach((p, index) => {
                if (libNameArr.indexOf(p.name) === -1) {
                    arr.push({name: p.name, index, rootIndex})
                    readLibs(p, arr, index, libNameArr)
                    libNameArr.push(p.name)
                }
            })
    }
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
    checkBrowserList()
    let drOpt = options.pluginOptions ? options.pluginOptions.dr : {}
    const {pkg} = service
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
        libs = []
        const libNameArr = []
        readLibs(pkg, libs, 0, libNameArr)
    }
    const libTran = libs.map(l => l.name)
    libTran.push('element-ui')
    //修改babel的配置
    if (options.transpileDependencies) {
        options.transpileDependencies = options.transpileDependencies.concat(libTran)
    } else {
        options.transpileDependencies = libTran
    }
    //修改terser的配置
    const terser = readOrCreate(options, 'terser')
    if (!terser.minify) {
        terser.minify = "esbuild"
    }
    if (terser.minify !== 'esbuild') {
        const terserOptions = readOrCreate(terser, 'terserOptions')
        readOrCreate(terserOptions, 'output').comments = false
    }
    if (!selector) {
        selector = defaultSelector
    }
    limit = Object.assign({
        maxChunks: 100, minChunkSize: 128 * 1000
    }, limit)
    return {views, libs, selector, limit}
}
/**
 * 校验browserslist，
 * 如果当前工程下面没有browserslist相关的定义，
 * 则尝试使用环境变量定义默认的browserslist
 */
const checkBrowserList = () => {
    if (readPkg().browserslist) {
        return
    }
    const fs = require('fs')
    if (fs.existsSync(path.resolve(process.cwd(), '.browserslistrc'))) {
        return;
    }
    if (fs.existsSync(path.resolve(process.cwd(), '.browserslist'))) {
        return;
    }
    if (!process.env.BROWSERSLIST) {
        //添加默认的配置
        process.env.BROWSERSLIST = ['> 1%', 'last 2 versions', 'not dead']
    }
}
/**
 * 获取模块路径
 * @param mod
 * @return {string}
 */
const moduleDir = (mod) => `${path.dirname(require.resolve(`${mod}/package.json`))}/`
/**
 * 获取指定模块的指定文件路径
 * @param mod
 * @param subPath
 */
const moduleFilePath = (mod, subPath) => path.resolve(moduleDir(mod), subPath)
module.exports = {
    parseOptions, defaultSelector, moduleDir, moduleFilePath, readOrCreate
}
