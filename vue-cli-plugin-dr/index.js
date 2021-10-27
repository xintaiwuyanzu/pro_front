const plugin = require('./src/cliPlugin')
const codeGen = require('./src/codeGen')
const command = require('./src/command')
const utils = require('./src/utils')
const babelPlugin = require('@vue/cli-plugin-babel')
/**
 * 导出vue-cli-plugin
 * @type {function(*=, *=): void}
 * //TODO 可以从resolve入手修改
 */
module.exports = (api, options) => {
    const drOptions = utils.parseOptions(api, options)
    //先注册自定义命令
    // command(api, options)
    //先动态成成代码
    codeGen(api, options, drOptions)
    //先执行babel，在执行自己
    //TODO 这里应该可以拦截babel配置，注入自定义的preset
    babelPlugin(api, options)
    //在魔改配置项
    plugin(api, options, drOptions)
}
