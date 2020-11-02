import utils from '../utils'

/**
 * v-charts 懒加载
 * @param vue
 */
export default (vue) => {
    vue.component('VeMap', utils.makeSync(import(/* webpackChunkName: "ec-map" */'v-charts/src/packages/map')))
}
