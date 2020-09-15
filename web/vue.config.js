module.exports = {
    productionSourceMap: false,
    pages: {
        index: {
            entry: './src/main.js', title: '达融基础开发平台'
        },
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
