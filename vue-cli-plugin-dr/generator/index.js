const fs = require('fs')
module.exports = (api, opts, rootOptions) => {
    getMain = () => {
        const tsPath = api.resolve('src/main.ts')
        return fs.existsSync(tsPath) ? 'src/main.ts' : 'src/main.js'
    }
    api.extendPackage({
        dependencies: {
            'element-ui': '^2.10.1',
            '@dr/lib': '^0.1.0'
        }/*,
        devDependencies: {
            'imagemin-webpack-plugin': '^2.4.2'
        }*/
    });
    if (opts.dll) {
        api.extendPackage({
            scripts: {
                'dll': 'vue-cli-service dll'
            },
            devDependencies: {
                "vue-cli-plugin-dll": "^1.1.5"
            }
        });
    }
    api.render({'./src/plugins/myPlugin.js': './template/src/plugins/myPlugin.js'})
    api.injectImports(getMain(), `import './plugins/myPlugin.js'`)
}
