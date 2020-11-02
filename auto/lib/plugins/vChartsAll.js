import vCharts from "./vCharts";
import vChartsAmap from "./vChartsAmap";
import vChartsBmap from "./vChartsBmap";
import vChartsmap from "./vChartsmap";
import vChartsHeatMap from "./vChartsHeatMap";

/**
 * v-charts 懒加载
 * @param vue
 */
export default (vue) => {
    vCharts(vue)
    vChartsAmap(vue)
    vChartsBmap(vue)
    vChartsmap(vue)
    vChartsHeatMap(vue)
}
