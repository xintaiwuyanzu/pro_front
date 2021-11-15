const path = require('path')
const util = require('../utils')
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

const {isWindows} = require('@vue/cli-shared-utils')

function genTranspileDepRegex(transpileDependencies) {
    const deps = transpileDependencies.map(dep => {
        if (typeof dep === 'string') {
            const p = util.moduleDir(dep);
            const depPath = p.substr(0, p.length - 1)
            return isWindows
                ? depPath.replace(/\\/g, '\\\\') // double escape for windows style path
                : depPath
        } else if (dep instanceof RegExp) {
            return dep.source
        }
    })
    return deps.length ? new RegExp(deps.join('|')) : null
}

function buildBabelExclude({transpileDependencies = []}, libs) {
    const cliServicePath = path.dirname(require.resolve('@vue/cli-service'))
    const transpileDepRegex = genTranspileDepRegex(transpileDependencies.concat(libs.map(l => l.name)).concat('element-ui'))
    return filepath => {
        // always transpile js in vue files
        if (/\.vue\.jsx?$/.test(filepath)) {
            return false
        }
        // exclude dynamic entries from cli-service
        if (filepath.startsWith(cliServicePath)) {
            return true
        }

        // only include @babel/runtime when the @vue/babel-preset-app preset is used
        if (
            process.env.VUE_CLI_TRANSPILE_BABEL_RUNTIME &&
            filepath.includes(path.join('@babel', 'runtime'))
        ) {
            return false
        }

        // check if this is something the user explicitly wants to transpile
        if (transpileDepRegex && transpileDepRegex.test(filepath)) {
            return false
        }
        // Don't transpile node_modules
        return /node_modules/.test(filepath)
    }
}

module.exports = {
    /**
     *optimization.splitChunks参数
     */
    splitChunks: {
        cacheGroups
    },
    chunks: Object.keys(cacheGroups),
    buildBabelExclude
}
