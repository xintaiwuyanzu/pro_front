/**
 *常用工具方法
 */
/**
 * 是否开发环境
 * @type {boolean}
 */
const dev = process.env.NODE_ENV == 'development'
/**动态创建vue对象
 *
 * @param vue
 * @param componentName
 * @returns {*}
 */
const newComponent = (vue, componentName, ops = {}) => {
    const params = {
        render(h) {
            return h(componentName)
        },
        ...ops
    }
    console.log(params)
    return new vue(params)
}

export default {
    dev,
    newComponent
}
