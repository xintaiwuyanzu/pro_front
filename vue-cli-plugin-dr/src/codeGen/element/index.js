const path = require('path')
const fs = require('fs')
const utils = require('../../utils')

/**
 * 生成element字符串数组
 */
function genElements() {
    const fixPath = fs.existsSync(utils.moduleFilePath("@dr/framework", 'src/fix/FixCnMessageFormItem.js'))
    const datas = Object.keys(require('./components.json'))
        .map(name => {
            let path = `element-ui/lib/${name}.js`
            //这里修复formItem
            if (name === 'form-item' && fixPath) {
                //TODO 这里拦截不优雅，可以用webpack加载拦截
                path = '@dr/framework/src/fix/FixCnMessageFormItem.js'
            }
            return {
                name: `El${require('uppercamelcase')(name)}`,
                css: name,
                path,
            }
        }).filter(c => ['Loading', 'MessageBox', 'Notification', 'Message', 'InfiniteScroll'].indexOf(c.name) === -1)
    datas.push({
        path: 'element-ui/lib/transitions/collapse-transition.js',
        name: 'ElCollapseTransition'
    })
    return datas
}

/**
 *动态生成element-ui组件，用来实现组件懒加载
 */
module.exports = (cacheDirectory) => {
    const filePath = path.resolve(cacheDirectory, 'elements.js')
    if (!fs.existsSync(filePath)) {
        const elementThemePath = path.resolve(utils.moduleDir('element-ui'), 'packages/theme-chalk/src')
        const eol = require('os').EOL

        //验证生成elements.js文件
        const eleStr = genElements().map(e => {
            const cssPath = path.resolve(elementThemePath, `${e.css}.scss`).split('\\').join('/')
            const ePath = e.path.split('\\').join('/')
            if (fs.existsSync(cssPath)) {
                return {name: e.name, css: `element-ui/packages/theme-chalk/src/${e.css}.scss`, path: ePath}
            } else {
                return {name: e.name, path: ePath}
            }
        }).map(({name, css, path}) => {
            if (css) {
                return `            { 
                name:"${name}",
                component:import(/* webpackChunkName: "el-${name}" */"${path}"),
                css:import(/* webpackChunkName: "elcs-${name}" */"${css}"),
            }`
            } else {
                return `            {
                name:"${name}",
                component:import(/* webpackChunkName: "el-${name}" */"${path}")
            }`
            }
        }).join(`,${eol}`)

        const elementData = `export default [ ${eol}${eleStr}${eol}]`
        fs.writeFileSync(filePath, elementData, 'utf-8')
    }
}
