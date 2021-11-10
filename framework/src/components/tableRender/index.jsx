import fixColumn from '../../fix/FixTableColumnWithStatus'
import './style.scss'

export const functionUtils = (refId, functionArr) => {
    return functionArr.reduce((o, funName) => {
        o[funName] = function () {
            const ref = this.$refs[refId]
            if (ref) {
                const refFunction = ref[funName]
                if (refFunction) {
                    refFunction.apply(ref, arguments)
                }
            }
        }
        return o
    }, {})
}
export const tableFunctions = [
    'clearSelection',
    'toggleRowSelection',
    'toggleAllSelection',
    'toggleRowExpansion',
    'setCurrentRow',
    'clearSort',
    'clearFilter',
    'doLayout',
    'sort'
]

/**
 * TODO 这里是不是可以继承table
 * 列表渲染组件
 */
export default {
    inheritAttrs: false,
    props: {
        /**
         * 索引页面
         */
        index: {type: Boolean, default: true},
        /**
         * 是否可以多选
         */
        selectAble: {type: Boolean, default: false},
        /**
         * 列默认属性
         */
        defaultColumn: {type: Object, default: () => ({})},
        /**
         * 所有的列组件
         */
        columns: {type: Array},
        /**
         *是否显示分页组件
         */
        showPage: {type: Boolean, default: false},
        /**
         * 分页属性
         */
        page: {type: Object}
    },
    methods: functionUtils('table', tableFunctions),
    render() {
        const slots = this.$slots
        const children = (this.columns || []).map(props => {
            const prop = props.prop
            const propSlot = slots[prop]
            if (propSlot) {
                if (Array.isArray(propSlot) && propSlot.length === 1) {
                    return propSlot[0]
                } else {
                    return propSlot
                }
            }

            //todo追加默认属性
            return <fixColumn
                //声明属性
                {...{props}}
                //默认属性
                {...{props: this.defaultColumn}}
            />
        })
        //是否添加列
        if (this.index) {
            children.unshift(<fixColumn page={this.page}/>)
        }
        if (this.selectAble) {
            children.unshift(<fixColumn type='selection'/>)
        }
        if (Array.isArray(slots.default)) {
            slots.default.forEach(s => children.push(s))
        } else {
            children.push(slots.default)
        }
        const tableArgs = {
            ref: 'table',
            props: {
                border: true,
                ...this.$attrs
            },
            on: this.$listeners
        }

        if (this.showPage && this.page) {
            const pageArgs = {
                on: {
                    //page的事件发送出去，其他的事件都可以直接代理的，但是跟table有个重名的问题
                    'size-change': v => this.$emit('size-change', v),
                    'prev-click': (v) => this.$emit('prev-click', v),
                    'next-click': (v) => this.$emit('next-click', v),
                    'current-change': (v) => this.$emit('page-current-change', v)
                }
            }
            return (
                <div class="table-wrapper">
                    <div class='render-table'>
                        <el-table {...tableArgs} height='100%'>
                            {children}
                        </el-table>
                    </div>
                    <page page={this.page} {...pageArgs} class='render-page'/>
                </div>
            )
        } else {
            return (<el-table {...tableArgs}>{children}</el-table>)
        }
    }
}
