module.exports = {
    /**
     *根路径
     */
    root: 'src/store',
    /**
     *文件匹配正则
     */
    fileNameMatcher: ['+(*.js|*.jsx)', '*/index.+(js|jsx)'],
    /**
     * 根据变量模板生成要插入的单条字符串
     * @param name
     * @param path
     * @returns {string}
     */
    template({name, requirePath}) {
        return `{name:"${name}",value: require('${requirePath}')}`
    }
}
