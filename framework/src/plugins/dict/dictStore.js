/**
 * 字典相关的vuex
 */
export default {
    state: {
        //前端缓存所有的字典，key是type，value是数据，通过一次次的请求逐步丰富起来
        dicts: {}
    },
    mutations: {
        /**
         * 有新的字典数据添加，缓存在store中
         * @param state
         * @param dict
         */
        dictLoaded(state, dict) {
            if (dict) {
                Object.keys(dict).forEach(k => state.dicts[k] = dict[k])
            }
        }
    }
}
