import {Option, Select} from "element-ui";

/**
 * 映射选项
 * @param context
 * @returns {*|{label: *, value: boolean|*}[]}
 */
export const selectMap = (context) => {
    const mapperData = context.mapperData.data
    return Array.isArray(mapperData) ?
        mapperData.map(d => {
            if (typeof d === 'string') {
                return {label: d, value: d}
            } else {
                return mapKeyValue(d[context.valueKey], context.value, context.simpleMapper)
            }
        })
        :
        Object.keys(mapperData).map(k => mapKeyValue(k, context.value, context.simpleMapper))
}

const mapKeyValue = (value, modelValue, mapper) => {
    const valueType = typeof modelValue
    if (valueType === 'number') {
        try {
            //处理一下数字类型的字典
            value = parseInt(value)
        } catch (ignore) {
            /*eslint-disable*/
        }
    } else if (valueType === 'boolean') {
        try {
            if (value === 'false') {
                value = false
            } else if (value === 'true') {
                value = true
            } else {
                //处理一下boolean类型的
                value = !!value
            }
        } catch (ignore) {
            /*eslint-disable*/
        }
    }
    let label = mapper(value)
    if (Array.isArray(label)) {
        //TODO 这块显示有问题，所以这样强制转换了一下
        label = label.join(' ')
    }
    return {label, value}
}


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
    let children = selectMap(context)
    return (
        <Select  {...args}>
            {
                children.map(({label, value}) => <Option label={label} value={value}/>)
            }
        </Select>
    )
}