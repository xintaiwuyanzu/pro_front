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
/**
 * 将对象转换为数组类型
 * @param arr
 * @return {*[]}
 */
export const makeArray = (arr) => {
    let result = arr || []
    if (!Array.isArray(arr) && typeof arr === 'object') {
        result = []
        Object.keys(arr).forEach(key => {
            result.push({prop: key, ...arr[key]})
        })
    }
    return result
}
/**
 * 根据field计算children
 * @param arr
 * @param context
 * @param vNodeFunction
 * @return {(*)[]}
 */
export const computeChildren = (arr, context, vNodeFunction) => {
    const slotObject = (context.$slots.default || []).reduce((obj, vNode) => {
        const props = vNode.componentOptions ? vNode.componentOptions.propsData : vNode.asyncMeta.data.props
        const key = props.prop || 'default'
        const arr = obj[key] = obj[key] || []
        arr.push(vNode)
        return obj
    }, {})
    const useSlotNameArr = []
    const children = makeArray(arr)
        .filter(f => {
            //过滤掉不显示的子项
            const show = f.show
            if (show === undefined) {
                return true
            }
            return show
        })
        .map(props => {
            const prop = props.prop
            const propSlot = slotObject[prop]
            if (propSlot) {
                useSlotNameArr.push(prop)
                return propSlot
            } else {
                return vNodeFunction(props)
            }
        })
    Object.keys(slotObject)
        .forEach(k => {
            if (useSlotNameArr.indexOf(k) < 0 && k !== 'default') {
                slotObject[k]
                    .forEach(v => children.push(v))
            }
        })
    //添加默认slot
    if (slotObject.default) {
        slotObject.default.forEach(v => children.push(v))
    }
    return children
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
    name: 'tableRender',
    props: {
        /**
         * 索引页面
         */
        index: {type: Boolean, default: true},
        /**
         * 是否可以多选
         */
        checkAble: {type: Boolean, default: false},
        /**
         * 列默认属性
         */
        defaultColumnProps: {
            type: Object,
            default: () => (
                {
                    align: 'center',
                    'header-align': 'center',
                    'show-overflow-tooltip': true
                }
            )
        },
        /**
         * 所有的列组件
         * Array时每个对象的prop属性是key
         * Object时key是key，value是对象
         */
        columns: [Array, Object],
        /**
         *是否显示分页组件
         */
        showPage: {type: Boolean, default: true},
        /**
         * 分页属性
         */
        page: {type: Object}
    },
    methods: functionUtils('table', tableFunctions),
    render() {
        const children = computeChildren(this.columns, this, props => <el-table-column
            //声明属性
            {...{props}}
            //默认属性
            {...{props: this.defaultColumnProps}}
        />)
        //是否添加列
        if (this.index && this.page) {
            children.unshift(<el-table-column page={this.page}/>)
        }
        if (this.checkAble) {
            children.unshift(<el-table-column type='selection'/>)
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
