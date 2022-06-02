import {Form} from "element-ui";
import {functionUtils, vNodeSlots} from "../tableRender/utils";
import {renderObject} from "./containerRender";
import './style.scss'

export {registerField} from './fieldRender'
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
        defaultFieldProps: {type: Object, default: () => ({clearable: true})},
        /**
         * 提交之前回调，总共两个参数
         * 第一个参数是表单数据，第二个参数是提交参数
         */
        beforeSubmit: {type: Function}
    },
    data() {
        return {
            //保存状态
            saving: false,
            //日期类型的字段
            dateFields: new Set()
        }
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
                /*eslint-disable-next-line no-console*/
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
                            } else if (this.dateFields.has(k)) {
                                if (!value) {
                                    //过滤日期类型的数据，没设置填上0
                                    value = 0
                                }
                            }
                            parsedFormData[k] = value
                        })
                        const requestParams = {...parsedFormData, ...appendParams}
                        if (this.beforeSubmit) {
                            const submitResult = await this.beforeSubmit(formData, requestParams)
                            if (!(submitResult === true || submitResult === undefined)) {
                                return {success: false, message: submitResult}
                            }
                        }
                        const result = await this.$post(url, requestParams)
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
    created() {
        //监听日期类型字段渲染
        this.$on('dateFields', v => this.dateFields.add(v))
    },
    render() {
        const vSlots = new vNodeSlots(this.$slots.default)
        let children = renderObject(this.fields, this, vSlots)
        //再算最前面的
        children = vSlots.getFirst().concat(children)
        //再算默认剩下的
        children = children.concat(vSlots.getDefault())
        //最后算最后的
        children = children.concat(vSlots.getLast())
        const className = (this.$attrs.inline !== undefined && this.$attrs.inline !== false) ? 'form-render form-render--inline' : 'form-render'
        return (<Form ref='form' class={className} props={this.$attrs} on={this.$listeners}>{children}</Form>)
    }
}