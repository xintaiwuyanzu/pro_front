const cacheGroups = {
    cpn: {
        idHint: `cpn`,
        test: /[\\/](src\/components)[\\/]/,
        priority: -9,
        chunks: 'initial'
    },
    ve: {
        idHint: `ve`,
        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|core-js)[\\/]/,
        priority: -9,
        chunks: 'initial'
    },
    ec: {
        idHint: `ec`,
        test: /[\\/]node_modules[\\/](echarts|v-charts)[\\/]/,
        priority: -9,
        chunks: 'initial'
    },
    el: {
        idHint: `el`,
        test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
        priority: -9,
        chunks: 'initial'
    },
    defaultVendors: {
        idHint: `vendors`,
        test: /[\\/]node_modules[\\/]/,
        priority: -15,
        chunks: 'initial'
    },
    common: {
        idHint: `common`,
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
        chunks: 'all',
        cacheGroups
    },
    chunks: Object.keys(cacheGroups)
}
