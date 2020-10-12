const path = require('path')
const fs = require('fs')
const rootPath = process.cwd();
const pkg = require(path.resolve(rootPath, 'package.json'))
const nodeModulePath = path.resolve(rootPath, 'node_modules')
const elementThemePath = path.resolve(rootPath, 'node_modules/element-ui/packages/theme-chalk')
const config = []

Object.keys(pkg.dependencies)
    .map(p => require(path.resolve(nodeModulePath, `${p}/package.json`)))
    .filter(p => p.dlib)
    .forEach(p => {
        const configFile = path.resolve(nodeModulePath, p.name, 'src/styles/var.scss')
        if (fs.existsSync(configFile)) {
            config.push(path.relative(nodeModulePath, configFile).split('\\').join('/'))
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
