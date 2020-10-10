module.exports = {
    /**
     *根路径
     */
    root: 'src/store',
    /**
     *文件匹配正则
     */
    fileNameMatcher: ['+(*.js|*.jsx)', '*/+(index.js|index.jsx)'],
    /**
     * 判断是否能够替换
     */
    injectMatcher: /(\/\/inject stores here)/,
    /**
     * 根据变量模板生成要插入的单条字符串
     * @param name
     * @param path
     * @returns {string}
     */
    template({name, path}) {
        return `{path:${path},component: () => import(/* webpackChunkName: "ck-[index]" */'${path}')}`
    },
    /**
     * join连接符
     */
    separator: ',\r\n'
}
