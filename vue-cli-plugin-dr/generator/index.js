module.exports = (api, opts, rootOptions) => {
    delete api.generator.pkg.dependencies['core-js']
    api.extendPackage({
        dependencies: {
            '@dr/core': '^0.0.1'
        },
        babel: {
            presets: ['vue-cli-plugin-dr/preset']
        }
    })
    /*getMain = () => {
        const tsPath = api.resolve('src/main.ts')
        return fs.existsSync(tsPath) ? 'src/main.ts' : 'src/main.js'
    }
    api.render({'./src/plugins/myPlugin.js': './template/src/plugins/myPlugin.js'})
    api.injectImports(getMain(), `import './plugins/myPlugin.js'`)*/
}
