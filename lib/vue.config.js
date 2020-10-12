module.exports = {
    productionSourceMap: false,
    devServer: {
        port: 80,
        proxy: {
            '/api': {
                target: 'http://da.r-sys.cn/api',
                pathRewrite: {'^/api': '/'}
            }
        }
    }
}
