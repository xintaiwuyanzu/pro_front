const hardSource = require('hard-source-webpack-plugin')
const webpack = require('webpack')
const utils = require('./autoCodePlugin/utils')
const makeArray = (arr) => {
    if (arr) {
        if (Array.isArray(arr)) {
            return arr
        } else {
            return [arr]
        }
    } else {
        return []
    }
}
/**
 * 从pluginOptions读取配置信息并且传给 autoCodePlugin
 * 用来判断自动加载哪些页面
 *
 * @param service
 * @param options
 * @returns {{libs: *, views: *}}
 */
const parseOptions = ({service}, options) => {
    let drOpt = options.pluginOptions ? options.pluginOptions.dr : {}
    const {pkg, context} = service
    //router　视图　　库文件
    let {views, libs} = drOpt
    views = makeArray(views)
    libs = makeArray(libs)
    if (libs.length === 0) {
        libs = Object.keys(pkg.dependencies)
            .map(p => require(`${context}/node_modules/${p}/package.json`))
            .filter(p => p.dlib)
            .map(p => p.name)
    }
    return {views, libs}
}
module.exports.default = {AA:""}
module.exports = (api, options) => {
    const drOptions = parseOptions(api, options)
    //计算hash，用来缓存计算
    api.chainWebpack(cfg => {
        //添加缓存
        cfg.plugin('hard-source-webpack-plugin')
            .use(hardSource)
        //添加最小限制
        cfg.plugin('LimitChunkCountPlugin')
            .use(webpack.optimize.LimitChunkCountPlugin,
                [{
                    maxChunks: 200,
                    minChunkSize: 5120
                }])
        cfg.module.rule('js')
            .exclude
            .clear()
            .add(utils.vueExclude(options, drOptions))
            .end()
            .use('cache-loader')
            .tap(ops => {
                return {
                    write: utils.cacheWrite,
                    ...ops
                }
            })
        //自定义拦截，在babel前面自动注入自定义标签
        cfg.module.rule('js')
            .before('babel-loader')
            .use('autoCodePlugin')
            .loader(require.resolve('./autoCodePlugin'))
            .options(drOptions)
        //添加代码打包
        cfg.optimization.splitChunks({
            cacheGroups: {
                ve: {
                    name: `ve`,
                    test: /[\\/]node_modules[\\/](vue|vue-router|vuex|core-js)[\\/]/,
                    priority: -9,
                    chunks: 'initial'
                },
                ec: {
                    name: `ec`,
                    test: /[\\/]node_modules[\\/](echarts|v-charts)[\\/]/,
                    priority: -9,
                    chunks: 'initial'
                },
                el: {
                    name: `el`,
                    test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
                    priority: -9,
                    chunks: 'initial'
                },
                vendors: {
                    name: `vendors`,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -15,
                    chunks: 'initial'
                },
                common: {
                    name: `common`,
                    minChunks: 2,
                    priority: -16,
                    chunks: 'initial',
                    maxInitialRequests: 5,
                    minSize: 0,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        })
        //如果是多页面，手动添加chunks
        if (options.pages) {
            Object.keys(options.pages)
                .forEach(p => {
                    cfg.plugin(`html-${p}`)
                        .tap(args => {
                            args[0].chunks = ['ve', 'el', 'ec', 'vendors', 'common', ...args[0].chunks]
                            return args
                        })
                })
        }
    })
}
