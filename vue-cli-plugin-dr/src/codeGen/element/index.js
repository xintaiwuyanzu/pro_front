const components = require('./components.json')
const path = require('path')
const fs = require('fs')
const rootPath = process.cwd();
const elementPath = path.resolve(rootPath, 'node_modules/element-ui/')
const elementThemePath = path.resolve(elementPath, 'packages/theme-chalk/src')
const varPath = 'src/styles/var.scss'
const eol = require('os').EOL
const scss = require('sass')
const writeJson = require('write-json-file')
const uppercamelcase = require('uppercamelcase')
const cleanCss = require('clean-css')
const fontPath = path.resolve(elementThemePath, 'fonts').split('\\').join('/')
/**
 * 读取所有模块的var文件
 * @param api
 * @param libs
 * @returns {*}
 */
const readVars = (api, libs) => {
    const vars = libs.map(l => path.resolve(rootPath, 'node_modules', l.name, varPath))
        .filter(p => fs.existsSync(p))
        .reverse()
    const prjVar = path.resolve(rootPath, varPath)
    if (fs.existsSync(prjVar)) {
        vars.push(prjVar)
    }
    return vars.map(p => p.split('\\').join('/'))
}

/**
 * 根据路径和全局变量生成新的css文件
 * @param cssDir
 * @param vars
 */
function parseCss(cssDir, vars) {
    const arr = vars.map(c => `@import "${c}";`)
    arr.push(`$--font-path: '${fontPath}';`)

    const varData = arr.join(eol)
    const cssFiles = fs.readdirSync(elementThemePath)
    cssFiles.forEach(f => {
        if (path.extname(f) === '.scss' && f !== 'display.scss') {
            const file = path.resolve(elementThemePath, f)
            const scssData = fs.readFileSync(file, 'utf-8')
            if (!!scssData) {
                //过滤掉空的css数据
                const data = [varData, scssData].join(eol)
                const result = scss.renderSync({file, data, includePaths: [elementThemePath]})
                const output = new cleanCss().minify(result.css)
                let cssPath = path.resolve(cssDir, `${f.split('.')[0]}.css`)
                if (f === 'index.scss') {
                    cssPath = path.resolve(cssPath, '../../theme.css')
                }
                fs.writeFileSync(cssPath, output.styles, 'utf-8')
            }
        }
    })
}

/**
 * 生成element字符串数组
 */
function genElements() {
    const datas = Object.keys(components)
        .map(name => {
            return {
                name: `El${uppercamelcase(name)}`,
                css: name,
                path: path.resolve(elementPath, `lib/${name}.js`),
            }
        }).filter(c => ['Loading', 'MessageBox', 'Notification', 'Message', 'InfiniteScroll'].indexOf(c.name) === -1)
    datas.push({
        path: path.resolve(elementPath, 'lib/transitions/collapse-transition.js'),
        name: 'ElCollapseTransition'
    })
    return datas
}

/**
 *动态生成element-ui组件，用来实现组件懒加载
 */
module.exports = (api, libs) => {
    const vars = readVars(api, libs)
    //验证缓存生成样式
    const {cacheDirectory, cacheIdentifier} = api.genCacheConfig('pluginDr', {}, vars)
    const cssDir = path.resolve(cacheDirectory, cacheIdentifier)
    if (fs.existsSync(cssDir)) {
        return
    }
    fs.mkdirSync(cssDir, {recursive: true})
    parseCss(cssDir, vars)
    //验证生成elements.js文件
    const eleJsonFile = path.join(cacheDirectory, 'ele.json')
    let elements;
    if (fs.existsSync(eleJsonFile)) {
        elements = require(eleJsonFile)
    } else {
        elements = genElements(cssDir)
        writeJson.sync(eleJsonFile, elements)
    }
    const eleStr = elements.map(e => {
        const cssPath = path.resolve(cssDir, `${e.css}.css`).split('\\').join('/')
        const ePath = e.path.split('\\').join('/')
        if (fs.existsSync(cssPath)) {
            return {name: e.name, css: cssPath, path: ePath}
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
    fs.writeFileSync(path.resolve(cacheDirectory, 'elements.js'), elementData, 'utf-8')
}
