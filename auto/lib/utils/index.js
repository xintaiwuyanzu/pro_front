import error from './error'
import loading from './loading'
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
    return new vue(params)
}

const makeSync = (component, css) => {
    let p;
    if (css) {
        p = new Promise(resolve => {
            css.then(() => {
                resolve(component)
            })
        })
    } else {
        p = component
    }
    return () => {
        return {
            component: p,
            error,
            loading
        }
    }
}
export default {
    dev,
    newComponent,
    makeSync
}