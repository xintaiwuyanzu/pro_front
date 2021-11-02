const path = require('path')
const fs = require('fs')
const rootPath = process.cwd();
const util = require('../../utils')
const pkg = require(path.resolve(rootPath, 'package.json'))

const nodeModulePath = path.resolve(rootPath, 'node_modules')
const elementThemePath = util.moduleFilePath('element-ui', 'packages/theme-chalk')
const config = []

Object.keys(pkg.dependencies)
    .map(p => {
        //这里加载可能失败ahooks-vue，失败的就不处理了
        let pkg = {}
        try {
            pkg = require(util.moduleFilePath(p, `package.json`))
        } catch (e) {
        }
        return pkg
    })
    .filter(p => p.dlib)
    .forEach(p => {
        const configFile = util.moduleFilePath(p.name, 'src/styles/var.scss')
        if (fs.existsSync(configFile)) {
            config.push(configFile.split('\\').join('/'))
        }
    })
const file = path.resolve(elementThemePath, 'src/index.scss')

let data = config.map(c => `@import "${c}";`).concat(fs.readFileSync(file, "utf8")).join('\r\n')
/**
 *基本配置信息
 */
module.exports = {
    data,
    file,
    includePaths: [nodeModulePath],
    out: path.resolve(rootPath, 'src/styles'),
    fontPath: path.resolve(elementThemePath, 'lib/fonts')
}
