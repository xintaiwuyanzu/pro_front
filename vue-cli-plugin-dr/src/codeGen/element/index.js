const path = require('path')
const fs = require('fs')
const utils = require('../../utils')

/**
 * 替换element组件，增强功能的组件
 * @type {[{path: string, module: string, name: string}]}
 */
const fixCmps = [
    /**
     * 修复校验信息为中文
     */
    {name: 'form-item', module: '@dr/framework', path: 'src/fix/FixFormItem.jsx'},
    /**
     * 修复弹窗为自适应窗口最大高度
     */
    {name: 'dialog', module: '@dr/framework', path: 'src/fix/FixDialog.jsx'},
    /**
     * 修复column带有字典渲染
     */
    {name: 'table-column', module: '@dr/framework', path: 'src/fix/FixTableColumn.jsx'}
]

/**
 * 生成element字符串数组
 */
function genElements() {
    const fixMap = {}
    fixCmps.filter(({module, path}) => fs.existsSync(utils.moduleFilePath(module, path)))
        .forEach(c => fixMap[c.name] = `${c.module}/${c.path}`);

    const components = require('./components.json')
    const datas = Object.keys(components)
        .map(name => {
            //let path = `element-ui/lib/${name}.js`
            let path = `element-ui/${components[name]}`
            //这里修复formItem
            //TODO 这里拦截不优雅，可以用webpack加载拦截
            if (fixMap[name]) {
                path = fixMap[name]
            }
            return {
                name: `El${require('uppercamelcase')(name)}`,
                //TODO 可以使用sass-migrator更新scss的问题
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
                component:import("${path}"),
                css:import("${css}"),
            }`
            } else {
                return `            {
                name:"${name}",
                component:import("${path}")
            }`
            }
        }).join(`,${eol}`)

        const elementData = `export default [ ${eol}${eleStr}${eol}]`
        fs.writeFileSync(filePath, elementData, 'utf-8')
    }
}
