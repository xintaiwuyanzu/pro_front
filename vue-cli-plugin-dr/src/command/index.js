const genTheme = require('./genTheme')
/**
 * 注册自定义命令
 * @param api
 * @param options
 */
module.exports = (api, options) => {
    api.registerCommand('genTheme', genTheme.opts,genTheme)
}
