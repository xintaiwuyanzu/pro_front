module.exports = {
    /**
     *根路径
     */
    root: 'src/plugins',
    /**
     *文件匹配正则
     */
    fileNameMatcher: ['+(*.js|*.jsx)', '*/+(index.js|index.jsx)'],
    /**
     * 判断是否能够替换
     */
    injectMatcher: /(\/\/inject plugins here)/,
    /**
     * 根据变量模板生成要插入的单条字符串
     * @param name
     * @param path
     * @returns {string}
     */
    template({name, path, fullPath}) {
        return `require('${fullPath}').default(vue,ops)`
    },
    /**
     * join连接符
     */
    separator: '\r\n'
}
