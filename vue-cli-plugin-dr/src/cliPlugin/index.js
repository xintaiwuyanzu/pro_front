const fs = require('fs')
const path = require('path')
const config = require('./config')
const utils = require('../utils')
const css = require('./css')
const rootPath = process.cwd();
module.exports = (api, options, drOptions) => {
    //css相关的配置太多了，单独抽到一个独立的文件中
    css(api, options, drOptions)
    api.configureWebpack(cfg => {
        cfg.cache = {type: "filesystem"}
    })
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
        //@vue/composition-api
        cfg.resolve.alias.set('@vue/composition-api$', '@vue/composition-api/dist/vue-composition-api.esm.js')
        //TODO 强制设置，需要详细研究mjs和esm区别
        cfg.resolve.alias.set('@vue/composition-api/dist/vue-composition-api.mjs', '@vue/composition-api/dist/vue-composition-api.esm.js')
        //babel添加添加自定义preset
        cfg.module.rule('js').uses.get('babel-loader').options({presets: ['@dr/vue-cli-plugin-dr/preset']})
        //添加最小限制
        if (api.service.mode === 'production') {
            //控制chunk数量
            cfg.plugin('LimitChunkCountPlugin').use(webpack.optimize.LimitChunkCountPlugin, [{maxChunks: drOptions.limit.maxChunks}])
            cfg.plugin('MinChunkSizePlugin').use(webpack.optimize.MinChunkSizePlugin, [{minChunkSize: drOptions.limit.minChunkSize}])
            //gzip压缩文件
            cfg.plugin('CompressionWebpackPlugin').use(require('compression-webpack-plugin'), [{
                test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, threshold: 128 * 1000
            }])
            //moment
            cfg.plugin('moment').use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])
            //添加代码打包 TODO 暂时不处理打包优化的问题，好像默认的就可以了
            /*cfg.optimization.splitChunks(Object.assign(config.splitChunks, {
                minSize: limit.minChunkSize,
                maxSize: 384 * 1000,
                defaultSizeTypes: ['javascript', 'css']
            }))
            cfg.performance.maxEntrypointSize(512 * 1000).maxAssetSize(384 * 1000)*/
        }
        //计算title
        const pkg = api.service.pkg
        const computeTitle = (arg) => {
            if (arg.title === pkg.name) {
                if (pkg.description) {
                    arg.title = pkg.description
                }
            }
        }
        //计算系统编码
        cfg.plugin("define").tap((args) => {
            args[0]["process.env"].sys = {sysCode: JSON.stringify(pkg.sysCode || 'default')};
            return args;
        });

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
