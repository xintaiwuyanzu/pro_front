const fs = require('graceful-fs')
const path = require('path')
const reader = require('./reader')
const writeJsonFile = require("write-json-file");

/**
 * 根据配置动态生成代码
 * @param api
 * @param options
 */
module.exports = (api, options, {views, libs, selector, cacheDir, cacheDirectory}) => {
    require('./element')(cacheDirectory)
//依赖包数据
    let libData = {}
    reader.injects.forEach(i => {
        const configPath = path.resolve(cacheDir, i + '.json')
        if (fs.existsSync(configPath)) {
            libData[i] = require(configPath)
        } else {
            const paths = {}
            Object.entries(reader.readLib(i, libs)).forEach(([name, arr]) => paths [name] = selector(i, name, arr))
            writeJsonFile.sync(configPath, paths)
            libData[i] = paths
        }
    })
    //项目数据
    const prjData = reader.readPrj(views)
    //合并所有数据，生成指定的文件
    Object.keys(libData).forEach(key => {
        const data = Object.assign({}, libData[key], prjData[key])
        const filePath = path.resolve(cacheDirectory, `${key}.js`)
        //生成js文件
        fs.writeFile(filePath, reader.render(key, data))
    })
}
