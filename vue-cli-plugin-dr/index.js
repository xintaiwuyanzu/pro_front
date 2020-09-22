const hardSource = require('hard-source-webpack-plugin')
const processPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')
module.exports = (api, options) => {
    api.chainWebpack(cfg => {
        //添加缓存
        cfg.plugin('hard-source-webpack-plugin')
            .use(hardSource)
        //添加进度条
        cfg.plugin('progress-bar-webpack-plugin')
            .use(processPlugin)
        //添加最小限制
        cfg.plugin('LimitChunkCountPlugin')
            .use(webpack.optimize.LimitChunkCountPlugin,
                [{
                    maxChunks: 200,
                    minChunkSize: 5120
                }])
        //添加代码打包
        cfg.optimization.splitChunks({
            cacheGroups: {
                ve: {
                    name: `ve`,
                    test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
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
