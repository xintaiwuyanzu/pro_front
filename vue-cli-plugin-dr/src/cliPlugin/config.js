const cacheGroups = {
    cpn: {
        name: `cpn`,
        test: /[\\/](src\/components)[\\/]/,
        priority: -9,
        chunks: 'initial'
    },
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
        reuseExistingChunk: true,
        enforce: true
    }
}

module.exports = {
    /**
     *optimization.splitChunks参数
     */
    splitChunks: {
        cacheGroups
    },
    chunks: Object.keys(cacheGroups)
}
