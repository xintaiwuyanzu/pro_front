import utils from '../utils'

/**
 * v-charts 懒加载
 * @param vue
 */
export default (vue) => {
    vue.component('VeAmap', utils.makeSync(import(/* webpackChunkName: "ec-amap" */'v-charts/src/packages/amap')))
}
