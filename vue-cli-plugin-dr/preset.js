const path = require('path')
const babelImport = require('babel-plugin-import')
const cacheDir = path.resolve(process.cwd(), 'node_modules', '.cache', 'pluginDr')
module.exports = () => ({
    presets: [
        [
            require('@vue/babel-preset-app'),
            {
                jsx: {
                    vModel: true,
                    compositionAPI: true,
                    injectH: true
                }
            }
        ]
    ],
    plugins: [
        //TODO 可以从resolve入手修改
        [babelImport,
            {
                libraryName: '@dr/auto',
                customName: (transformedMethodName) => path.resolve(cacheDir, transformedMethodName),
                style: false
            }, 'auto'],
        [babelImport,
            {
                libraryName: 'element-ui',
                libraryDirectory: 'packages',
                style: false
            }, 'el']
    ]
})
