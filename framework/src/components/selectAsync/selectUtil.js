/**
 * select 用的工具类 用来返回render函数
 * @param prop
 * @param context
 * @returns {function()} 返回render响应式函数
 */
export const selectRender = (context) => {
    const args = {
        attrs: {
            placeholder: context.$attrs.placeHolder
        },
        props: {
            ...context.$attrs,
            multiple: context.multiple,
            value: context.value,
            loading: context.mapperData.loading
        },
        on: {
            ...context.$listeners,
            input: (v) => context.$emit('input', v)
        }
    }
    let children
    const mapperData = context.mapperData.data
    if (Array.isArray(mapperData)) {
        children = mapperData.map(d => {
            let value = d[context.valueKey]
            if (typeof context.value === 'number') {
                try {
                    //处理一下数字类型的字典
                    value = parseInt(value)
                } catch (ignore) {
                    /*eslint-disable*/
                }
            }
            const label = context.simpleMapper(value)
            return <el-option label={label} value={value}/>
        })
    } else {
        children = Object.keys(mapperData)
            .map(k => {
                const label = context.simpleMapper(k)
                if (typeof context.value === 'number') {
                    try {
                        //处理一下数字类型的字典
                        k = parseInt(k)
                    } catch (ignore) {
                        /*eslint-disable*/
                    }
                }
                return <el-option label={label} value={k}/>
            })
    }
    return (<el-select  {...args}>{children}</el-select>)
}