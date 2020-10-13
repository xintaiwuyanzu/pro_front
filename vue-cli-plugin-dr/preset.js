module.exports = () => ({
    presets: [
        require('@vue/babel-preset-app')
    ],
    plugins: [
        [require('babel-plugin-component'),
            {
                libraryName: 'vue-cli-plugin-dr',
                libDir: '../.cache/pluginDr',
                style: false
            }, 'dr'],
        [require('babel-plugin-component'),
            {
                libraryName: 'element-ui',
                style: false
            }, 'el']
    ]
})
