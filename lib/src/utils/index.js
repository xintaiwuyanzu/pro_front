/**
 *常用工具方法
 */
/**
 * 是否开发环境
 * @type {boolean}
 */
export const dev = process.env.NODE_ENV == 'development'
/**
 * 网络请求相关
 */
export * from './http'
