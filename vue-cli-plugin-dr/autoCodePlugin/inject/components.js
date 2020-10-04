module.exports = {
    /**
     *根路径
     */
    root: 'src/components',
    /**
     *文件匹配正则
     */
    fileNameMatcher: ['+(*.vue|*.js|*.jsx)', '*/+(index.vue|index.js|index.jsx)'],
    /**
     * 判断是否能够替换
     */
    /**
     * 判断是否能够替换
     */
    injectMatcher: /(\/\/inject components here)/,
    /**
     * 根据变量模板生成要插入的单条字符串
     * @param name
     * @param path
     * @returns {string}
     */
    template({name, path, fullPath}) {
        return `vue.component("${name}",require("${fullPath}").default)`
    },
    /**
     * join连接符
     */
    separator: '\r\n'
}
