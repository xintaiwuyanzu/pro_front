import {http} from "../http";

export const dictUtil = (store) => {
    return async (type) => {
        const dictState = store.state.dict.dicts
        if (!(dictState[type] && dictState[type].length > 0)) {
            const result = await http().post('/sysDict/dict', {type})
            if (result.data.success) {
                dictState[type] = type === 'organise' ?
                    result.data.data.filter(d => d.id !== '1') :
                    result.data.data
            }
        }
        return dictState[type]
    }
}
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
                Object.keys(dict)
                    .forEach(k => state.dicts[k] = dict[k])
            }
        }
    }
}
