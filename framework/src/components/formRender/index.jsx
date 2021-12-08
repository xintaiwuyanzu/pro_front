import {computeChildren, functionUtils} from "../tableRender";
import {getPropByPath} from 'element-ui/src/utils/util';

/**
 * 计算字段的属性
 * @param props
 * @param context
 * @param isCustom 是否自定义的扩展组件，自定义扩展组件通过attrs传参
 * @return {{directives: [{name: string, value}], style, attrs: (*&{placeHolder: (string|`${string}${string}`)}), props: (*&{value: *}), on: (*&{input: (function(*): *)})}}
 */
function computeArgs(props, context, isCustom) {
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
const defaultFields = {
    /**
     * input组件
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    input(props, context) {
        const args = computeArgs(props, context, false)
        return (<el-input {...args} />)
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
            return (<select-dict {...args} type={props.dictKey}/>)
        } else {
            return (<select-async  {...args}/>)
        }
    },
    /**
     * 日期选择
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    date(props, context) {
        const args = computeArgs(props, context, true)
        return (<el-date-picker value-format='timestamp' {...args}  />)
    },
    /**
     * 时间选择
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    time(props, context) {
        const args = computeArgs(props, context, true)
        return (<el-time-select value-format='timestamp' {...args}  />)
    },
    /**
     * 日期时间
     * @param props
     * @param context
     * @return {JSX.Element}
     */
    dateTime(props, context) {
        const args = computeArgs(props, context, true)
        return (<el-date-picker value-format='timestamp' {...args} type='datetime'/>)
    }
}
/**
 * 表单所有的方法映射出去
 * @type {*[]}
 */
export const formFunctions = [
    "validate",
    "validateField",
    "resetFields",
    "clearValidate"
]
/**
 * 表单渲染器
 * @author dr
 */
export default {
    inheritAttrs: false,
    name: 'formRender',
    props: {
        /**
         * 表单字段
         */
        fields: [Array, Object],
        /**
         * 字段默认属性
         */
        defaultFieldProps: {type: Object, default: () => ({clearable: true})}
    },
    data() {
        //保存状态
        return {saving: false}
    },
    methods: {
        ...functionUtils('form', formFunctions),
        /**
         * TODO 表单应该可以写个hook的
         * 校验并且提交表单
         * @param url
         * @param appendParams
         * @return {Promise<*>}
         */
        async submit(url, appendParams) {
            const formData = this.$attrs.model
            if (!formData) {
                console.error(`没有指定表单model`)
                return {success: false, message: `没有指定表单model`}
            } else {
                try {
                    const valid = await this.$refs.form.validate()
                    if (valid) {
                        const parsedFormData = {}
                        Object.keys(formData).forEach(k => {
                            let value = formData[k]
                            if (Array.isArray(value)) {
                                value = value.join(',')
                            }
                            parsedFormData[k] = value
                        })
                        const result = await this.$post(url, {...parsedFormData, ...appendParams})
                        if (result.status === 200) {
                            return result.data
                        } else {
                            return {success: false, message: result.statusText}
                        }
                    } else {
                        return {success: false, message: `请填写完整表单`}
                    }
                } catch {
                    return {success: false, message: `请填写完整表单`}
                }
            }
        }
    },
    render() {
        const children = computeChildren(this.fields, this, props => {
            const prop = props.prop
            //判断字段类型，选择组件
            const fieldType = props.fieldType || 'input'
            if (!defaultFields[fieldType]) {
                console.error(`没有指定的表单字段类型${fieldType}`, prop)
                return
            }
            if (!this.$attrs.model) {
                console.error(`没有指定表单model`)
                return
            }
            const children = defaultFields[fieldType](props, this)
            return (
                <el-form-item
                    //默认属性
                    {...{props: this.defaultFieldProps}}
                    //声明属性
                    {...{props}}>
                    {children}
                </el-form-item>
            )
        })
        //表单参数
        const args = {
            ref: 'form',
            props: {
                ...this.$attrs
            },
            on: this.$listeners
        }
        return (<el-form {...args}>{children}</el-form>)
    }
}