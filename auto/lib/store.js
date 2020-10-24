import vuex from 'vuex';
import createLogger from "vuex/dist/logger";
import utils from "./utils";
import {stores} from '@dr/auto'

const store = ({vue}) => {
    vue.use(vuex)
    const plugins = []
    if (utils.dev) {
        plugins.push(createLogger())
    }
    const modules = {}
    stores.forEach(s => modules[s.name] = s.value)
    return new vuex.Store({
        strict: utils.dev,
        modules,
        plugins
    })
}
export default {
    store
}
