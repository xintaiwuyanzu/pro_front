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
         * 可以直接声明选项数据
         *data为Object时，默认取对象的key为数据值，value为显示的值
         *data为Array时，根据labelKey取每条数据的数据值，根据valueKey取每条数据的显示值
         */
        data: [Object, Array]
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
            attrs: {
                placeholder: context.attrs.placeHolder
            },
            props: {
                ...context.attrs,
                value: prop.value,
                loading: data.loading
            },
            on: {
                ...context.listeners,
                input: (v) => context.emit('input', v)
            }
        }
        const computeData = prop.data || data.data
        let children
        if (Array.isArray(computeData)) {
            children = computeData.map(d => {
                let value = d[valueKey]
                if (typeof prop.value === 'number') {
                    try {
                        //处理一下数字类型的字典
                        value = parseInt(value)
                    } catch (ignore) {
                        /*eslint-disable*/
                    }
                }
                return <el-option label={d[labelKey]} value={value}/>
            })
        } else {
            children = Object.keys(computeData)
                .map(k => {
                    const v = computeData[k]
                    let value = typeof v === 'string' ? v : v[prop.labelKey]
                    if (typeof prop.value === 'number') {
                        try {
                            //处理一下数字类型的字典
                            value = parseInt(value)
                        } catch (ignore) {
                            /*eslint-disable*/
                        }
                    }
                    return <el-option label={value} value={k}/>
                })
        }
        return (<el-select  {...args}>{children}</el-select>)
    }
}