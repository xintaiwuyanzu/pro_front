const config = require('./config')
const sass = require('sass')
const fs = require('fs')
const path = require('path')
/**
 * 命令基本信息
 */
module.exports.opts = {
    description: '根据当前项目信息构建主题css',
    usage: 'vue-cli-service genTheme'
}
module.exports = () => {
    console.log('开始编译主题');
    const targetDir = path.resolve(config.out, 'fonts')
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true})
    }
    fs.readdirSync(config.fontPath)
        .forEach(file => {
            const targetPath = path.resolve(targetDir, file)
            if (!fs.existsSync(targetPath)) {
                fs.copyFileSync(path.resolve(config.fontPath, file), targetPath)
                console.log(`复制字体文件:${targetPath}`)
            }
        })
    const result = sass.renderSync({file: config.file, data: config.data, includePaths: config.includePaths})
    const themeFile = path.resolve(config.out, 'theme.css')
    fs.writeFileSync(themeFile, result.css, 'utf-8')
    console.log(`编译成功，主题css文件位于：${themeFile}\r\n请及时更新代码依赖`)
}
