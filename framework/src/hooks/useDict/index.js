import {onMounted, reactive} from "vue-demi";
import {useStore} from "@u3u/vue-hooks";
import {dictUtil} from "../../plugins/dict/dictStore";

/**
 * 根据指定的key返回响应式的字典
 * @param dictKey
 * @returns {UnwrapRef<{loading: boolean, key: *, dictArr: []}>}
 */
export const useDict = (dictKey) => {
    let dict = reactive({loading: false, key: dictKey, data: []});
    const store = useStore().value
    const loadFunction = dictUtil(store)
    //数据加载方法
    const load = async () => {
        dict.loading = true
        dict.data = await loadFunction(dict.key)
        dict.loading = false
    }
    //更新方法
    const update = (type, arr) => {
        const dictState = store.state.dict.dicts
        dictState[type] = arr
    }
    //watch(dict.key, (k) => $loadDict(k))
    //字典加载方法
    onMounted(async () => {
        if (dict.key) {
            await load(dict.key)
        }
    })
    return {
        dict,
        load,
        update
    }
}