const utils = require("../utils");
const {EOL: eol} = require("os");
const path = require("path");
const fs = require("fs");
const {getSass} = require('@zougt/some-loader-utils');
const writeJsonFile = require("write-json-file");
const rootPath = process.cwd();

/**
 *获取指定模块下的所有主题样式变量
 * @param moduleName
 * @param isPrj
 * @returns {{}}
 */
const readTheme = (moduleName, isPrj) => {
    //样式文件夹
    const stylePath = path.resolve(isPrj ? rootPath : utils.moduleDir(moduleName), 'src/styles')
    const result = {}
    if (fs.existsSync(stylePath)) {
        fs.readdirSync(stylePath)
            .forEach(f => {
                if (f.startsWith('var')) {
                    const fileName = f.split('.')[0]
                    const requirePath = isPrj ? `@/styles/${f}` : `${moduleName}/src/styles/${f}`
                    let varName = 'default'
                    if (fileName.startsWith('var-')) {
                        varName = fileName.replace('var-', '')
                    }
                    result[varName] = requirePath
                }
            })
    }
    return result
}

/**
 * 从依赖库中读取所有的主题变量
 * @param cacheDir
 * @param libs
 */
const readThemes = (cacheDir, libs) => {
    let libTheme = {}
    const cacheFileName = path.resolve(cacheDir, 'themes.json')
    if (fs.existsSync(cacheFileName)) {
        libTheme = require(cacheFileName)
    } else {
        libs.forEach(l => {
            const libt = readTheme(l.name, false)
            Object.keys(libt).forEach(k => {
                const libValue = libTheme[k] = libTheme[k] || []
                libValue.push(libt[k])
            })
        })
        writeJsonFile.sync(cacheFileName, libTheme)
    }
    return libTheme
}

module.exports = (api, options, {cacheDir, libs}) => {
    //修改css相关默认配置
    if (!Object.hasOwnProperty(options, 'productionSourceMap')) {
        options.productionSourceMap = false
    }
    //所有主题
    const themeAll = {}
    //依赖库主题
    const libTheme = readThemes(cacheDir, libs)
    Object.keys(libTheme).forEach(k => themeAll[k] = {lib: libTheme[k]})
    //项目主题
    const prjTheme = readTheme(rootPath, true)
    Object.keys(prjTheme).forEach(k => themeAll[k] ? themeAll[k].prj = prjTheme[k] : themeAll[k] = {prj: prjTheme[k]})

    const multipleScopeVarsSass = [];
    const multipleScopeVarsLess = [];

    Object.keys(themeAll).forEach(k => {
        const sassVars = []
        const lessVars = []
        let {lib, prj} = themeAll[k]
        if (lib) {
            lib.forEach(l => {
                sassVars.push(l)
                lessVars.push(l)
            })
        }
        if (prj) {
            sassVars.push(prj)
            lessVars.push(prj)
        }

        multipleScopeVarsLess.push({
            scopeName: k,
            varsContent: lessVars.reverse().map(k => `@forward "${k}";`).join(eol)
        })
        multipleScopeVarsSass.push({
            scopeName: k,
            varsContent: sassVars.reverse().map(k => `@import "${k}";`).join(eol)
        })
    })
    //只有包含自定义变量的时候才修改配置
    if (multipleScopeVarsSass.length > 0) {
        const cssOptions = utils.readOrCreate(options, 'css')
        const loaderOptions = utils.readOrCreate(cssOptions, 'loaderOptions')

        const less = utils.readOrCreate(loaderOptions, 'less')
        const lessOptions = utils.readOrCreate(less, 'lessOptions')
        lessOptions.javascriptEnabled = true
        if (!lessOptions.plugins) {
            lessOptions.plugins = []
        }
        lessOptions.plugins.push(require('less-plugin-sass2less'))

        const sass = utils.readOrCreate(loaderOptions, 'sass')

        if (multipleScopeVarsSass.length === 1) {
            //less变量
            lessOptions.plugins.push({
                install: (less, pluginManager) => pluginManager.addPreProcessor({
                    process: (src) => {
                        if (src.indexOf('dVars()') >= 0) {
                            src = src.split('dVars()').join(multipleScopeVarsLess[0].varsContent)
                        }
                        return src
                    }
                }, 1)
            })
            //sass变量
            console.info('追加全局sass变量')
            console.info(multipleScopeVarsSass[0].varsContent)
            sass.additionalData = async (content) => {
                const arr = content.split('@use')
                //todo 这里不会写正则，用暴力的方法
                if (arr.length > 1) {
                    const last = arr[arr.length - 1]
                    const index = last.indexOf(";")
                    arr[arr.length - 1] = last.substring(0, index + 1) + multipleScopeVarsSass[0].varsContent + last.substring(index + 1)
                    return arr.join('@use')
                }
                return [multipleScopeVarsSass[0].varsContent, content].join(eol)
            }
        } else {
            //多变量的情况
            //TODO less不知道怎么处理
            const dartSass = require('sass')
            const old = dartSass.render
            //重写render方法
            dartSass.render = (opt, callback) => {
                const data = opt.data.split('@@')
                const theme = data[0]
                const themeContent = multipleScopeVarsSass.filter(t => t.scopeName === theme)[0].varsContent

                let code = data[1]
                const arr = code.split('@use')
                //todo 这里不会写正则，用暴力的方法
                if (arr.length > 1) {
                    const last = arr[arr.length - 1]
                    const index = last.indexOf(";")
                    arr[arr.length - 1] = last.substring(0, index + 1) + themeContent + last.substring(index + 1)
                    code = arr.join('@use')
                } else {
                    code = [themeContent, code].join(eol)
                }
                return old.call(dartSass, {...opt, data: code}, callback)
            }
            sass.implementation = getSass({
                getMultipleScopeVars: () => multipleScopeVarsSass.map(v => ({...v, varsContent: v.scopeName + '@@'})),
                implementation: dartSass
            })
            api.chainWebpack(cfg => {
                const extract = process.env.NODE_ENV === 'production';
                const extractCssOutputDir = 'css/theme'
                cfg.plugin("define").tap((args) => {
                    args[0]["process.env"].themeConfig = {
                        multipleScopeVars: JSON.stringify(multipleScopeVarsSass),
                        extract: JSON.stringify(extract),
                        extractCssOutputDir: JSON.stringify(extractCssOutputDir),
                    };
                    return args;
                });
                cfg.plugin('ThemeCssExtractWebpackPlugin')
                    .use(require('@zougt/theme-css-extract-webpack-plugin'),
                        [{
                            extract,
                            defaultScopeName: 'default',
                            multipleScopeVars: multipleScopeVarsSass,
                            outputDir: extractCssOutputDir,
                            includeStyleWithColors: [
                                {
                                    color: "#ffffff",
                                    // 排除掉样式属性，这里将非背景的白色提升权重
                                    excludeCssProps: ["background", "background-color"],
                                    // 此类颜色的是否跟随主题色梯度变化，默认false
                                    // inGradient: true,
                                },
                            ],
                        }]
                    )
            })
        }
    }
}