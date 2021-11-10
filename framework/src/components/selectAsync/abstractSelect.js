/**
 * 抽象选择父类
 * 这里用来定义选择组件共用的属性
 */
export default {
    /**
     * 不继承属性，所有属性传递给el-select
     */
    inheritAttrs: false,
    props: {
        //v-model不能透传
        value: [String, Number],
        //el-option label
        labelKey: {type: String, default: 'label'},
        //el-option value
        valueKey: {type: String, default: 'id'},
        /**
         * 可以直接传选项数据
         */
        data: {type: Array}
    }
}

/**
 * select 用的工具类 用来返回render函数
 * @param prop
 * @param context
 * @param data 响应式数据 {data:[],loading:false}
 * @returns {function()} 返回render响应式函数
 */
export const selectRender = (prop,
                             context,
                             data
) => {
    return () => {
        const labelKey = prop.labelKey || 'label'
        const valueKey = prop.valueKey || 'id'
        const args = {
            props: {
                ...context.attrs,
                value: prop.value,
                loading: data.loading
            },
            on: {
                ...context.listeners,
                value: (v) => context.emit('value', v)
            }
        }
        return (<el-select  {...args}>
            {(prop.data ? prop.data : data.data).map(d => <el-option label={d[labelKey]} value={d[valueKey]}/>)}
        </el-select>)
    }
}