module.exports = {
    productionSourceMap: false,
    pages: {
        index: {entry: './src/main.js', title: '资产信息化管理系统'},
    },
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
