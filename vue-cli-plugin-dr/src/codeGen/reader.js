const path = require('path')
const injects = require('./inject')
const util = require('../utils')
const glob = require('glob')

module.exports.injects = Object.keys(injects)
/**
 * 根据数据生成和模板生成数据
 * @param key  模板名称
 * @param data 源代码文件
 */
module.exports.render = (key, data) => {
    return `export default [\r\n${
        Object.keys(data)
            .map(name => Object.assign({name}, data[name]))
            .map(d => injects[key].template(d))
            .join(',\r\n')
    }
    ]`
}
module.exports.readLib = (key, libs) => {
    const value = injects[key]
    let obj = {}
    libs.forEach(lib => {
        const cwd = util.moduleDir(lib.name)
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
                        const requirePath = `${lib.name}/${path.relative(cwd, fullPath).split(path.sep).join('/')}`
                        const name = path.relative(root, fileMeta.name === 'index' ? fileMeta.dir : path.join(fileMeta.dir, fileMeta.name)).split(path.sep).join('/')
                        const d = {libName: lib.name, index: lib.index, name, fullPath, requirePath}
                        obj[name] ? obj[name].push(d) : obj[name] = [d]
                    })
            })
    })
    return obj
}
/**
 * 读取项目本身的配置
 * @param ops
 */
module.exports.readPrj = (views = []) => {
    const cwd = path.resolve(process.cwd())
    let data = {}
    Object.entries(injects)
        .forEach(([key, value]) => {
            let obj = {}
            data[key] = obj
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
                            const requirePath = `@/` + path.relative(cwd + '/src/', fullPath).split(path.sep).join('/')
                            const name = path.relative(root, fileMeta.name === 'index' ? fileMeta.dir : path.join(fileMeta.dir, fileMeta.name)).split(path.sep).join('/')
                            obj[name] = {name, fullPath, requirePath}
                        })
                })
        })
    if (views.length > 0) {
        const reg = new RegExp(`(${views.join('|')})`)
        data.views = Object.entries(data.views)
            .filter(([key]) => reg.test(key))
            .reduce((r, [k, v]) => {
                r[k] = v
                return r
            }, {})
    }
    return data
}
