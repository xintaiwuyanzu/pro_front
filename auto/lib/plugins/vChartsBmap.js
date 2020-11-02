import utils from '../utils'

/**
 * v-charts 懒加载
 * @param vue
 */
export default (vue) => {
    vue.component('VeBmap', utils.makeSync(import(/* webpackChunkName: "ec-bmap" */'v-charts/src/packages/bmap')))
}
