const cacheDir = require('find-cache-dir')({name: 'dr-loader'});
const envHash = require('hard-source-webpack-plugin/lib/envHash')
const fs = require('graceful-fs')
const path = require('path')
const writeJson = require('write-json-file')
const injects = require('./inject')
const glob = require('glob')

/**
 * 读取当前项目的数据
 * @param rootPath
 * @param libs
 */
const readDatas = (rootPath, libs) => {
    let data = {}
    Object.entries(injects)
        .forEach(([key, value]) => {
            let obj = data[key]
            if (!obj) {
                data[key] = obj = {}
            }
            libs.forEach(l => {
                const cwd = path.resolve(rootPath, l)
                const root = path.resolve(cwd, value.root)
                let fileNameMatcher = value.fileNameMatcher
                if (!Array.isArray(fileNameMatcher)) {
                    fileNameMatcher = [fileNameMatcher]
                }
                fileNameMatcher.map(m => path.resolve(root, m))
                    .forEach(pattern => {
                        glob.sync(pattern)
                            .forEach(fullPath => {
                                const fileMeta = path.parse(fullPath)
                                const requirePath = path.relative(rootPath, fullPath).split(path.sep).join('/')
                                const name = path.relative(root, fileMeta.name === 'index' ? fileMeta.dir : path.join(fileMeta.dir, fileMeta.name)).split(path.sep).join('/')
                                obj[name] = {name, fullPath, requirePath}
                            })
                    })
            })
        })
    return data
}

/**
 * 读取项目本身的配置
 * @param ops
 */
const readProject = ({views = []}) => {
    const data = readDatas(path.resolve(process.cwd()), ['./'], '@/')
    if (views.length > 0) {
        let {router} = data
        const reg = new RegExp(`(${views.join('|')})`)
        data.router = Object.entries(router)
            .filter(([key]) => reg.test(key))
            .reduce((r, [k, v]) => {
                r[k] = v
                return r
            }, {})
    }
    return data
}
/**
 * 读取依赖的注入
 * @param ops
 */
const readLib = ({jsonPath, libs}) => {
    const data = readDatas(path.resolve(process.cwd(), 'node_modules/'), libs)
    writeJson.sync(jsonPath, data)
    return data
}
/**
 * hash文件，避免重复计算hash
 */
let CURRENT_HASH;
let data
/**
 * 计算数据或者从缓存中读取数据
 * @param hash
 * @returns {*}
 */
const computeOfReadFromCache = options => {
    const {hash, views, libs} = options
    //如果上下文中有数据，则直接使用数据
    if (data) {
        return data
    }
    CURRENT_HASH = hash
    //尝试从缓存中读取库文件的数据，再动态计算views的数据
    const jsonPath = path.join(cacheDir, `${hash}.json`)
    let result
    if (fs.existsSync(jsonPath)) {
        result = Promise.all([require(jsonPath), readProject(options)])
    } else {
        if (fs.existsSync(cacheDir)) {
            //缓存json文件不存在的话，先清除缓存
            fs.rmdirSync(cacheDir, {recursive: true})
        }
        //再创建新的缓存
        result = Promise.all([readLib({jsonPath, ...options}), readProject(options)])
    }
    //最后返回所有的数据
    return result.then(([libData, projectData]) => {
        let datas = {}
        Object.keys(libData)
            .filter(k => {
                const autos = {...libData[k], ...projectData[k]}
                const inject = injects[k]
                datas[k] = Object.values(autos)
                    .map(inject.template)
                    .join(inject.separator)
            })
        data = datas
        return data
    })
}

/**
 *异步读取自动注入的信息
 * @param options
 */
const readData = options => {
    const start = CURRENT_HASH ? Promise.resolve(CURRENT_HASH) : Promise.resolve(envHash())
    return start.then(hash => computeOfReadFromCache({hash, ...options}))
}
/**
 * 读取全局配置的数据
 * @param options
 */
module.exports = options => {
    return readData(options)
}
