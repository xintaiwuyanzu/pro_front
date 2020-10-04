module.exports = {
    /**
     *根路径
     */
    root: 'src/views/',
    /**
     *文件匹配正则
     */
    fileNameMatcher: '**/index.vue',
    /**
     * 判断是否能够替换
     */
    injectMatcher: /(\/\/inject router here)/,
    /**
     * 根据变量模板生成要插入的单条字符串
     * @param name
     * @param path
     * @returns {string}
     */
    template({name, requirePath, fullPath}) {
        return `{path:'/${name}',component: () => import(/* webpackChunkName: "${name}" */'${fullPath}')}`
    },
    /**
     * join连接符
     */
    separator: ',\r\n'
}
