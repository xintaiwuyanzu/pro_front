import moment from "moment";
import jwebV from 'jwebv'

const debug = process.env.NODE_ENV !== 'production'

const fmtDate = (v, fmt) => {
    if (!v) {
        return v
    }
    try {
        return moment(v).format(fmt)
    } catch (e) {
        return v
    }
}

const install = (vue, ops) => {
    vue.prototype.$moment = moment;
    vue.filter('date', (v, fmt) => fmtDate(v, fmt ? fmt : 'YYYY-MM-DD'))
    vue.filter('datetime', (v, fmt) => fmtDate(v, fmt ? fmt : 'YYYY-M-D H:m:s'))
    //安装工具包jwebV
    vue.use(jwebV)
}

const exports = {
    fmtDate,
    debug
}
/**
 *全局设置日期工具
 * @param vue
 * @param ops
 */
export default {install, exports}
