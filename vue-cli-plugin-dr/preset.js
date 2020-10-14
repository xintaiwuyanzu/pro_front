module.exports = () => ({
    presets: [
        require('@vue/babel-preset-app')
    ],
    plugins: [
        [require('babel-plugin-component'),
            {
                libraryName: '@dr/auto',
                libDir: '../../.cache/pluginDr',
                style: false
            }, 'auto'],
        [require('babel-plugin-component'),
            {
                libraryName: 'element-ui',
                style: false
            }, 'el']
    ]
})
