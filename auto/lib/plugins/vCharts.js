import utils from '../utils'

/**
 * v-charts 懒加载
 * @param vue
 */
export default (vue) => {
    vue.component('VeBar', utils.makeSync(import(/* webpackChunkName: "ec-bar" */'v-charts/src/packages/bar')))
    vue.component('VeHistogram', utils.makeSync(import(/* webpackChunkName: "ec-histogram" */'v-charts/src/packages/histogram')))
    vue.component('VeLine', utils.makeSync(import(/* webpackChunkName: "ec-line" */'v-charts/src/packages/line')))
    vue.component('VePie', utils.makeSync(import(/* webpackChunkName: "ec-pie" */'v-charts/src/packages/pie')))
    vue.component('VeRing', utils.makeSync(import(/* webpackChunkName: "ec-ring" */'v-charts/src/packages/ring')))
    vue.component('VeWaterfall', utils.makeSync(import(/* webpackChunkName: "ec-waterfall" */'v-charts/src/packages/waterfall')))
    vue.component('VeFunnel', utils.makeSync(import(/* webpackChunkName: "ec-funnel" */'v-charts/src/packages/funnel')))
    vue.component('VeRadar', utils.makeSync(import(/* webpackChunkName: "ec-radar" */'v-charts/src/packages/radar')))
    vue.component('VeChart', utils.makeSync(import(/* webpackChunkName: "ec-chart" */'v-charts/src/packages/chart')))
    vue.component('VeMap', utils.makeSync(import(/* webpackChunkName: "ec-map" */'v-charts/src/packages/map')))
    vue.component('VeBmap', utils.makeSync(import(/* webpackChunkName: "ec-bmap" */'v-charts/src/packages/bmap')))
    vue.component('VeAmap', utils.makeSync(import(/* webpackChunkName: "ec-amap" */'v-charts/src/packages/amap')))
    vue.component('VeSankey', utils.makeSync(import(/* webpackChunkName: "ec-map" */'v-charts/src/packages/sankey')))
    vue.component('VeHeatmap', utils.makeSync(import(/* webpackChunkName: "ec-map" */'v-charts/src/packages/heatmap')))
    vue.component('VeScatter', utils.makeSync(import(/* webpackChunkName: "ec-scatter" */'v-charts/src/packages/scatter')))
    vue.component('VeCandle', utils.makeSync(import(/* webpackChunkName: "ec-candle" */'v-charts/src/packages/candle')))
    vue.component('VeGauge', utils.makeSync(import(/* webpackChunkName: "ec-gauge" */'v-charts/src/packages/gauge')))
    vue.component('VeTree', utils.makeSync(import(/* webpackChunkName: "ec-tree" */'v-charts/src/packages/tree')))
    vue.component('VeLiquidfill', utils.makeSync(import(/* webpackChunkName: "ec-liquidfill" */'v-charts/src/packages/liquidfill')))
    vue.component('VeWordcloud', utils.makeSync(import(/* webpackChunkName: "ec-wordcloud" */'v-charts/src/packages/wordcloud')))
}
