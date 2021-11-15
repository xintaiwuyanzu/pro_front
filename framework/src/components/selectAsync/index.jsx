import {http} from "../../plugins/http";
import {reactive, ref, watch} from "vue-demi";
import abstractSelect, {selectRender} from "./abstractSelect";

export default {
    name: 'selectAsync',
    extends: abstractSelect,
    props: {
        //数据异步加载方法
        loadFunction: {type: Function},
        //异步请求地址
        url: {type: String},
        //请求参数
        params: {
            type: Object, default: () => ({})
        },
        //请求方法
        requestMethod: {type: String, default: 'post'}
    },
    setup(prop, context) {
        const data = reactive({data: [], loading: false})
        const url = ref(prop.url)
        //监听url和请求参数，响应式的处理数据
        watch([url, prop.params], async (url, params) => {
            if (url.value) {
                data.loading = true
                //发送网络请求
                const result = await http()[prop.requestMethod === 'post' ? 'post' : 'get'](url.value, params)
                if (result.data.success) {
                    data.data = result.data.data
                }
            } else if (prop.loadFunction) {
                data.loading = true
                data.data = await prop.loadFunction(params)
            }
            data.loading = false
        })
        return selectRender(prop, context, data)
    }
}