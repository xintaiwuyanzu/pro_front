import {useDict} from "../../hooks/useDict";
import {Option, Select} from 'element-ui'
import {watch} from "vue-demi";

export default {
    inheritAttrs: false,
    name: 'selectDict',
    props: {
        //要渲染的字典的字段
        type: {type: String, require: true},
        value: {}
    },
    setup(prop, context) {
        const {dict, load} = useDict(prop.type)
        watch(() => prop.type, (n, o) => {
            if (n && n !== o) {
                dict.key = n
                load()
            }
        })

        return () => {
            const args = {
                attrs: {
                    placeholder: context.attrs.placeHolder
                },
                props: {
                    ...context.attrs,
                    value: prop.value,
                    loading: dict.loading
                },
                on: {
                    ...context.listeners,
                    input: (v) => context.emit('input', v)
                }
            }

            const children = dict.data.map(d => {
                let value = d.id
                if (typeof prop.value === 'number') {
                    try {
                        //处理一下数字类型的字典
                        value = parseInt(value)
                    } catch (ignore) {
                        /*eslint-disable*/
                    }
                }
                return <Option label={d.label} value={value}/>
            })
            return (<Select  {...args}>{children}</Select>)
        }
    }
}