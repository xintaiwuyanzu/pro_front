module.exports = {
    pages: {
        index: {entry: './examples'},
    },
    productionSourceMap: false,
    devServer: {
        port: 80,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8081/api',
                pathRewrite: {'^/api': '/'}
            }
        }
    }
}
