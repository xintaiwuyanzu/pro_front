import utils from '../utils'

/**
 * v-charts 懒加载
 * @param vue
 */
export default (vue) => {
    vue.component('VeHeatmap', utils.makeSync(import(/* webpackChunkName: "ec-heatmap" */'v-charts/src/packages/heatmap')))
}
