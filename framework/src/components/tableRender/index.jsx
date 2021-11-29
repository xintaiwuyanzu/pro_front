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

function getProps(vNode) {
    return vNode.componentOptions ? vNode.componentOptions.propsData : vNode.asyncMeta.data.props
}

/**
 * 根据field计算children
 * @param arr
 * @param context
 * @param vNodeFunction
 * @return {(*)[]}
 */
export const computeChildren = (arr, context, vNodeFunction) => {
    arr = makeArray(arr)
    const allPropName = arr.map(a => a.prop)
    let lastName = '$default'
    const slotObject = {}
    //设置了before和after的vNodes
    const beforeAfter = []
    const slotDefault = context.$slots.default
    if (slotDefault) {
        //倒序排列slot
        for (let i = slotDefault.length; i > 0; i--) {
            const vNode = slotDefault[i - 1]
            const props = getProps(vNode)
            //前后的slot
            if (props.brfore || props.after) {
                beforeAfter.unshift(vNode)
            } else if ('expand' === props.type) {
                const arr = slotObject['$expand'] = slotObject['$expand'] || []
                //table的expand放在最前面
                arr.push(vNode)
            } else {
                let key = props.prop
                if (key) {
                    if (allPropName.indexOf(key) < 0) {
                        key = lastName
                    } else {
                        lastName = key
                    }
                } else {
                    key = lastName
                }
                const arr = slotObject[key] = slotObject[key] || []
                arr.unshift(vNode)
            }
        }
    }
    const children = arr
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
                return propSlot
            } else {
                return vNodeFunction(props)
            }
        })
    //添加默认slot
    if (slotObject.$default) {
        slotObject.$default.forEach(v => children.push(v))
    }
    if (slotObject.$expand) {
        slotObject.$expand.forEach(v => children.unshift(v))
    }

    if (beforeAfter.length > 0) {
        beforeAfter.forEach(vNode => {
            const props = getProps(vNode)
            const propName = props.before || props.after
            const isBefore = !!props.before
            const propIndex = children.findIndex(v => {
                const vProp = getProps(v)
                return vProp.prop === propName
            })
            if (propIndex < children.length && props >= 0) {
                children.splice(isBefore ? propIndex : propIndex + 1, 0, vNode)
            } else {
                children.push(vNode)
            }
        })
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
