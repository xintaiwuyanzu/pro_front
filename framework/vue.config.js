module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://demo3.r-sys.cn/api',
                pathRewrite: {'^/api': '/'}
            }
        }
    }
}
