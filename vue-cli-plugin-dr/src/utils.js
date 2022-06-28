const path = require('path')
const readPkg = require('read-pkg')
const fs = require("graceful-fs");
const writeJsonFile = require("write-json-file");

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
 * 解析项目lib依赖
 * @param libs
 * @param cacheDir
 * @param api
 * @param options
 * @returns {[{name: string, index: number}]}
 */
const parseLibs = (libs, cacheDir, api, options) => {
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
        const libFile = path.resolve(cacheDir, 'libs.json')
        if (fs.existsSync(libFile)) {
            libs = require(libFile)
        } else {
            readLibs(api.service.pkg, libs, 0, libNameArr)
            writeJsonFile.sync(libFile, libs)
        }
    }

    const libTran = libs.map(l => l.name)
    libTran.push('element-ui')
    libTran.push('color')
    //修改babel的配置
    if (options.transpileDependencies) {
        options.transpileDependencies = options.transpileDependencies.concat(libTran)
    } else {
        options.transpileDependencies = libTran
    }

    return libs
}

/**
 * 解析 terser配置
 * @param options
 */
function parseTerser(options) {
    //修改terser的配置
    const terser = readOrCreate(options, 'terser')
    if (process.env.NODE_ENV === 'development') {
        //开发环境使用esbuild
        if (!terser.minify) {
            terser.minify = "esbuild"
        }
    }
    if (terser.minify !== 'esbuild') {
        const terserOptions = readOrCreate(terser, 'terserOptions')
        //readOrCreate(terserOptions, 'output').comments = false
        const format = readOrCreate(terserOptions, 'format')
        format.comments = false
    }
}

/**
 * 从pluginOptions读取配置信息并且传给 autoCodePlugin
 * 用来判断自动加载哪些页面
 *
 * @param api
 * @param options
 * @returns {{libs: *, views: *}}
 */
const parseOptions = (api, options) => {
    checkBrowserList()
    parseTerser(options)

    //计算缓存文件夹和环境hash
    const {cacheDirectory, cacheIdentifier} = api.genCacheConfig('pluginDr', {}, ['vue.config.js'])
    //先判断缓存是否存在
    const cacheDir = path.resolve(cacheDirectory, cacheIdentifier)
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, {recursive: true})
    }

    let drOpt = options.pluginOptions ? options.pluginOptions.dr : {}
    //router　视图　　库文件
    let {views, libs, selector, limit} = drOpt
    views = makeArray(views)
    //处理依赖库
    libs = parseLibs(libs, cacheDir, api, options)

    return {
        views,
        libs,
        selector: selector || defaultSelector,
        limit: Object.assign({maxChunks: 100, minChunkSize: 128 * 1000}, limit),
        cacheDirectory,
        cacheIdentifier,
        cacheDir
    }
}
/**
 * 校验browserslist，
 * 如果当前工程下面没有browserslist相关的定义，
 * 则尝试使用环境变量定义默认的browserslist
 */
const checkBrowserList = () => {
    if (readPkg.sync().browserslist) {
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
