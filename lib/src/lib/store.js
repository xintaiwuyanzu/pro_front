import vuex from 'vuex';
import createLogger from "vuex/dist/logger";
import utils from "./utils";

const store = () => {
    const plugins = []
    if (utils.dev) {
        plugins.push(createLogger())
    }
    return new vuex.Store({
        strict: utils.dev,
        modules: {
            //在这里插入store对象
            //inject stores here
        },
        plugins
    })
}
export default {
    store
}
