const fs = require('fs')
module.exports = (api, opts, rootOptions) => {
    api.extendPackage({
        dependencies: {
            '@dr/lib': '^0.0.1'
        }
    });
    /*getMain = () => {
        const tsPath = api.resolve('src/main.ts')
        return fs.existsSync(tsPath) ? 'src/main.ts' : 'src/main.js'
    }
    api.render({'./src/plugins/myPlugin.js': './template/src/plugins/myPlugin.js'})
    api.injectImports(getMain(), `import './plugins/myPlugin.js'`)*/
}
