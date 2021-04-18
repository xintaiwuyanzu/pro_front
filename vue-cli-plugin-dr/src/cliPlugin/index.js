const hardSource = require('hard-source-webpack-plugin')
const compress = require('compression-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const util = require('../utils')
let template = 'public/index.html'


if (!fs.existsSync(path.resolve(process.cwd(), template))) {
    template = util.moduleFilePath('@dr/vue-cli-plugin-dr', template)
}
module.exports = (api, options, {views, libs, selector, limit}) => {
    api.chainWebpack(cfg => {
        //添加缓存
        cfg.plugin('hard-source-webpack-plugin').use(hardSource)
        //moment
        cfg.plugin('moment').use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])
        //添加最小限制
        if (api.service.mode === 'production') {
            //控制chunk数量
            cfg.plugin('LimitChunkCountPlugin').use(webpack.optimize.LimitChunkCountPlugin, [limit])
            //gzip压缩文件
            cfg.plugin('CompressionWebpackPlugin').use(compress, [{
                test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                threshold: 10240
            }])
        }
        //添加代码打包
        cfg.optimization.splitChunks(config.splitChunks)
        //babel添加exclude
        cfg.module.rule('js').exclude.clear().add(config.buildBabelExclude(options, libs))
        //计算title
        const pkg = api.service.pkg
        const computeTitle = (arg) => {
            if (arg.title === pkg.name) {
                if (pkg.description) {
                    arg.title = pkg.description
                }
            }
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
