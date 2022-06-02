import {DatePicker, Input, TimeSelect} from "element-ui";
import {getPropByPath} from 'element-ui/src/utils/util';
import SelectDict from "../selectDict";
import SelectAsync from "../selectAsync";
import FormItem from "../../fix/FixFormItem";
import RadioAsync from "../radioAsync";
import CheckBoxAsync from "../checkBoxAsync";

/**
 * 计算字段的属性
 * @param props
 * @param context
 * @param isCustom 是否自定义的扩展组件，自定义扩展组件通过attrs传参
 * @return {{directives: [{name: string, value}], style, attrs: (*&{placeHolder: (string|`${string}${string}`)}), props: (*&{value: *}), on: (*&{input: (function(*): *)})}}
 */
export function computeArgs(props, context, isCustom) {
    const {on, style, fieldType, ...other} = props
    //补全placeHolder
    const placeHolderPre = fieldType === 'select' ? '请选择' : '请输入'
    const placeHolder = props.placeHolder || `${placeHolderPre}${props.label}`
    const attrs = isCustom ? {
        placeHolder,
        //默认属性
        ...context.defaultFieldProps,
        //手动声明属性
        ...other,
    } : {placeHolder}

    //这里为了删除type属性
    const value = getPropByPath(context.$attrs.model, props.prop)
    let findV = value.v
    if (findV || findV === 0) {
        //这里要处理一下多选的问题
        if (attrs.multiple && !Array.isArray(findV)) {
            const split = attrs.multipleSplit || ','
            findV = findV.split(split)
            value.o[value.k] = findV
        }
    } else {
        //TODO 这里有点暴力，为了实现响应式
        context.$set(context.$attrs.model, props.prop, attrs.multiple ? [] : '')
    }
    return {
        //v-loading 指令
        directives: [
            {name: 'loading', value: props.loading}
        ],
        style,
        attrs,
        props: {
            //默认属性
            ...context.defaultFieldProps,
            //手动声明属性
            ...other,
            //v-model 展开
            value: findV
        },
        on: {
            //声明的监听方法
            ...on,
            input: (v) => value.o[value.k] = v
        }
    }
}

/**
 * 默认字段类型
 * @type {{}}
 */
export const defaultFields = {
    /**
     * input组件
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    input(props, context) {
        const args = computeArgs(props, context, false)
        return (<Input {...args} />)
    },
    /**
     * 选择控件
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    select(props, context) {
        const args = computeArgs(props, context, true)
        if (props.dictKey) {
            return (<SelectDict {...args} type={props.dictKey}/>)
        } else {
            return (<SelectAsync {...args}/>)
        }
    },
    /**
     * 日期选择
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    date(props, context) {
        context.$emit('dateFields', props.prop)
        const args = computeArgs(props, context, true)
        return (<DatePicker value-format='timestamp' {...args}  />)
    },
    /**
     * 时间选择
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    time(props, context) {
        context.$emit('dateFields', props.prop)
        const args = computeArgs(props, context, true)
        return (<TimeSelect value-format='timestamp' {...args}  />)
    },
    /**
     * 日期时间
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    dateTime(props, context) {
        context.$emit('dateFields', props.prop)
        const args = computeArgs(props, context, true)
        return (<DatePicker value-format='timestamp' {...args} type='datetime'/>)
    },
    /**
     * 单选
     * @param props
     * @param context
     * @returns {JSX.Element}
     */
    radio(props, context) {
        const args = computeArgs(props, context, true)
        return (<RadioAsync {...args}/>)
    },
    /**
     * 多选
     * @param props
     * @param context
     * @returns {JSX.Element}
     */
    checkBox(props, context) {
        props.multiple = true
        const args = computeArgs(props, context, true)
        return (<CheckBoxAsync {...args}/>)
    }
}
/**
 *注册自定义函数
 * @param fieldType
 * @param renderFucntion
 */
export const registerField = (fieldType, renderFucntion) => defaultFields[fieldType] = renderFucntion

/**
 * 字段渲染
 */
export const fieldRender = (fieldType, props, context) => {
    const fieldRender = defaultFields[fieldType]
    if (!fieldRender) {
        /*eslint-disable-next-line no-console*/
        console.error(`没有指定的表单字段类型${fieldType}`, props.prop)
        return
    }
    if (!context.$attrs.model) {
        /*eslint-disable-next-line no-console*/
        console.error(`没有指定表单model`)
        return
    }
    const fieldChild = fieldRender(props, context)
    let className = ''
    if (props.singleLine) {
        className += ' field_single_line'
    }
    const children = [
        (<FormItem
            class={className}
            props={{
                //默认属性
                ...context.defaultFieldProps,
                //声明属性
                ...props
            }}>
            {fieldChild}
        </FormItem>)
    ]
    if (props.newLine) {
        children.unshift(<br/>)
    }
    return children

}