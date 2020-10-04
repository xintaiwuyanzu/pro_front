const loadUtils = require('loader-utils')
const reader = require('./reader')
const parser = require('./parser')
const utils = require('./utils')

/**
 *webpack插件,自动追加相关代码
 */
module.exports = function (content, map, meta) {
    let options = loadUtils.getOptions(this);
    options.context = this.context
    //确定异步执行
    const callback = this.async();
    //异步判断是否需要修改代码
    parser({content, options})
        .then(({inject, contentArr}) => {
            //需要修改代码的话
            if (inject) {
                this.cacheable(false)
                utils.add(this.resourcePath)
                //使用reader扫描源码，返回拼装好的injectKey,value对象
                return reader(options)
                    .then(sources => contentArr.map(v => v.injectKey ? sources[v.injectKey] : v).join('\r\n'))
            } else {
                return content
            }
        }).then(c => callback(null, c, map, meta))
}
