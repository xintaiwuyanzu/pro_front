const fs = require('fs')
const path = require('path')
const config = require('./config')
const rootPath = process.cwd();
const utils = require('../utils')
const {EOL: eol} = require("os");
const varPath = 'src/styles/var.scss'
/**
 *项目级变量
 * @type {string}
 */
const prjVarExist = fs.existsSync(path.resolve(rootPath, varPath))
const prjVarPath = prjVarExist ? `@import "@/styles/var.scss";` : ''
/**
 * 读取配置或者设置新的配置
 * @param obj
 * @param key
 * @returns {*}
 */
const readOrCreate = (obj, key) => {
    let value = obj[key]
    if (!value) {
        value = {}
        obj[key] = value
    }
    return value
}


/**
 * 读取所有模块的var文件
 * @param api
 * @param libs
 * @returns {*}
 */
const readVars = (api, libs) => {
    const result = libs.map(l => ({name: l.name, varPath: path.resolve(utils.moduleDir(l.name), varPath)}))
        .filter(p => fs.existsSync(p.varPath))
        .map(p => `~${p.name}/${varPath}`)
        .reverse()
    return result
}


module.exports = (api, options, {views, libs, selector, limit}) => {
    //修改css相关默认配置
    if (!Object.hasOwnProperty(options, 'productionSourceMap')) {
        options.productionSourceMap = false
    }
    const cssOptions = readOrCreate(options, 'css')
    const loaderOptions = readOrCreate(cssOptions, 'loaderOptions')

    const less = readOrCreate(loaderOptions, 'less')
    const lessOptions = readOrCreate(less, 'lessOptions')
    lessOptions.javascriptEnabled = true
    const vars = readVars(api, libs)
    if (vars.length > 0 || prjVarExist) {
        //按顺序添加所有模块的变量
        const addStrLess = vars.map(v => `@import "${v}";`).join(eol)

        const lessAddArr = [addStrLess, prjVarPath]

        if (!lessOptions.plugins) {
            lessOptions.plugins = []
        }

        lessOptions.plugins.push({
            install: (less, pluginManager) => {
                pluginManager.addPreProcessor({
                    process: (src, ext) => {
                        if (src.indexOf('dVars()') >= 0) {
                            src = src.split('dVars()').join(lessAddArr.join(eol))
                        }
                        return src
                    }
                }, 1)
            }
        })
        lessOptions.plugins.push(require('less-plugin-sass2less'))
        //less 变量是懒加载的，项目级的变量是最后的  https://www.tutorialspoint.com/less/less_default_variables.htm
        /*if (less.additionalData) {
            lessAddArr.push(less.additionalData)
        }
        less.additionalData = lessAddArr.join(eol)
        console.info('追加全局less变量')
        lessOptions.modifyVars = `${addStrLess}${eol}${prjVarPath}`
        console.info(less.additionalData)*/
        const sass = readOrCreate(loaderOptions, 'sass')
        //sass全局变量有默认变量的存在，所以优先加载项目上的变量
        const sassAddArr = [prjVarPath, addStrLess]
        //TODO function
        if (sass.additionalData) {
            sassAddArr.unshift(sass.additionalData)
        }
        sass.additionalData = sassAddArr.join(eol)
        console.info('追加全局sass变量')
        console.info(sass.additionalData)

    }
    api.chainWebpack(cfg => {
        //入口文件是否存在
        const mainJsExist = fs.existsSync(path.resolve(rootPath, 'src/main.js'));
        if (!mainJsExist && !options.entryFiles) {
            //TODO  如果入口文件不存在，则使用默认的
            if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
                cfg.mode(process.env.NODE_ENV)
                    .context(api.service.context)
                    .entry('app')
                    .clear()
                    .add('@dr/auto/main.js')
                    .end()
            }
        }
        const webpack = require('webpack')
        //添加缓存
        cfg.plugin('hard-source-webpack-plugin').use(require('hard-source-webpack-plugin'))
        //@vue/composition-api
        cfg.resolve.alias.set('@vue/composition-api$', '@vue/composition-api/dist/vue-composition-api.esm.js')
        //添加最小限制
        if (api.service.mode === 'production') {
            //控制chunk数量
            cfg.plugin('LimitChunkCountPlugin').use(webpack.optimize.LimitChunkCountPlugin, [{maxChunks: limit.maxChunks}])
            cfg.plugin('MinChunkSizePlugin').use(webpack.optimize.MinChunkSizePlugin, [{minChunkSize: limit.minChunkSize}])
            //gzip压缩文件
            cfg.plugin('CompressionWebpackPlugin').use(require('compression-webpack-plugin'), [{
                test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                threshold: 128 * 1000
            }])
            //moment
            cfg.plugin('moment').use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])
            //添加代码打包
            cfg.optimization.splitChunks(config.splitChunks)
            cfg.performance.maxEntrypointSize(512 * 1000).maxAssetSize(384 * 1000)
            //压缩
            const terserOptions = require('@vue/cli-service/lib/config/terserOptions')
            cfg.optimization
                .minimizer('terser')
                .use(require('terser-webpack-plugin'), [Object.assign(terserOptions(options), {terserOptions: {output: {comments: false}}})])
        }
        //babel添加exclude
        cfg.module.rule('js').exclude.clear().add(config.buildBabelExclude(options, libs))
        cfg.module.rule('js').uses.get('babel-loader').options({presets: ['@dr/vue-cli-plugin-dr/preset']})
        //计算title
        const pkg = api.service.pkg
        const computeTitle = (arg) => {
            if (arg.title === pkg.name) {
                if (pkg.description) {
                    arg.title = pkg.description
                }
            }
        }
        //html模板路径
        let template = 'public/index.html'
        if (!fs.existsSync(path.resolve(rootPath, template))) {
            template = utils.moduleFilePath('@dr/vue-cli-plugin-dr', template)
        }
        //如果是多页面，手动添加chunks
        if (options.pages) {
            Object.keys(options.pages)
                .forEach(p => {
                    cfg.plugin(`html-${p}`)
                        .tap(args => {
                            args[0].chunks = [...config.chunks, ...args[0].chunks]
                            args[0].template = template
                            computeTitle(args[0])
                            return args
                        })
                })
        } else {
            cfg.plugin('html')
                .tap(args => {
                    args[0].template = template
                    computeTitle(args[0])
                    return args
                })
        }
    })
}
