const hardSource = require('hard-source-webpack-plugin')
const processPlugin = require('progress-bar-webpack-plugin')
module.exports = (api, options) => {
    api.chainWebpack(cfg => {
        options.productionSourceMap = false
        cfg.plugin('hard-source-webpack-plugin')
            .use(hardSource)
        cfg.plugin('progress-bar-webpack-plugin')
            .use(processPlugin)
        cfg.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    name: `chunk-vendors`,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -15,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                    enforce: true
                },
                ve: {
                    name: `chunk-ve`,
                    test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                    enforce: true
                },
                el: {
                    name: `chunk-el`,
                    test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                    enforce: true
                },
                common: {
                    name: `chunk-common`,
                    minChunks: 2,
                    priority: -5,
                    chunks: 'initial',
                    maxInitialRequests: 5,
                    minSize: 0,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        })
    })
}
