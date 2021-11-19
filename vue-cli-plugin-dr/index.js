const plugin = require('./src/cliPlugin')
const codeGen = require('./src/codeGen')
const utils = require('./src/utils')
const babelPlugin = require('@vue/cli-plugin-babel')
/**
 * 导出vue-cli-plugin
 * @type {function(*=, *=): void}
 * TODO 可以从resolve入手修改
 * TODO 区分dev和prod，dev时使用require.context解决重启的问题
 * TODO 重构代码生成和element补丁
 * TODO 项目可以自定义配置文件，直接声明用哪个组件
 * TODO 依赖排序问题
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
