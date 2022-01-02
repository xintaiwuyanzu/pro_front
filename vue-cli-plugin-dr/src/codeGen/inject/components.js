module.exports = {
    /**
     *根路径
     */
    root: 'src/components',
    /**
     *文件匹配正则
     */
    fileNameMatcher: ['+(*.vue|*.js|*.jsx)', '*/index.+(vue|js|jsx)'],
    /**
     * 根据变量模板生成要插入的单条字符串
     * @param name
     * @param path
     * @returns {string}
     */
    template({name, requirePath}) {
        return `{name:"${name}",component:import("${requirePath}")}`
    }
}
