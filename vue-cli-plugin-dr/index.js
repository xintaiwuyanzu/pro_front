const plugin = require('./src/cliPlugin')
const codeGen = require('./src/codeGen')
const command = require('./src/command')
/**
 * 导出vue-cli-plugin
 * @type {function(*=, *=): void}
 */
module.exports = (api, options) => {
    //先注册自定义命令
    command(api, options)
    //先动态成成代码
    codeGen(api, options)
    //在魔改配置项
    plugin(api, options)
}
/**
 *  导出vue router 使用的views
 *
 */
module.exports.views = []
/**
 * 导出vue 使用的component
 */
module.exports.components = []
/**
 *导出所有的插件
 * 注意这里的插件不是vue的，是自定义的
 */
module.exports.plugins = []
/**
 * 所有的字典
 * @type {*[]}
 */
module.exports.dicts = []
/**
 * 所有的vuex store
 * @type {*[]}
 */
module.exports.stores = []
