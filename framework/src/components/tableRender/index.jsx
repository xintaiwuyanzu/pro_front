import './style.scss'
import {Table} from 'element-ui'
import TableColumn from '../../fix/FixTableColumn'
import page from '../page'
import {functionUtils, makeArray, vNodeSlots} from "./utils";

/**
 * 根据field计算children
 * @param arr
 * @param slotDefault 默认slot
 * @param vNodeFunction
 * @return {(*)[]}
 */
const computeChildren = (arr, slotDefault, vNodeFunction, context) => {
    arr = makeArray(arr)
    arr = arr.filter(a => {
        if (a.role) {
            return context.hasRole(a.role)
        } else {
            return true
        }
    })
    const vSlots = new vNodeSlots(slotDefault, (vNode, props) => 'expand' === props.type)
    //先计算所有中间的child
    let children = arr.filter(f => f.show || f.show === undefined)
        .reduce((resultArr, props) => resultArr.concat(vSlots.getField(props, (f) => vNodeFunction(f))), [])
    //再算最前面的
    children = vSlots.getFirst().concat(children)
    //再算默认剩下的
    children = children.concat(vSlots.getDefault())
    //最后算最后的
    children = children.concat(vSlots.getLast())
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
        const children = computeChildren(this.columns, this.$slots.default, props => <TableColumn props={{
            //默认属性
            ...this.defaultColumnProps,
            //声明属性
            ...props
        }
        }/>, this)
        //是否添加列
        if (this.index && this.page) {
            children.unshift(<TableColumn page={this.page}/>)
        }
        if (this.checkAble) {
            children.unshift(<TableColumn type='selection'/>)
        }
        const tableArgs = {
            ref: 'table',
            props: {
                border: true,
                stripe: true,
                ...this.$attrs
            },
            on: this.$listeners
        }
        //如果数据量达不到分页，则不显示分页按钮
        let pageChild = ''
        if (this.showPage && this.page) {
            if (this.page.total >= this.page.size) {
                const pageArgs = {
                    on: {
                        //page的事件发送出去，其他的事件都可以直接代理的，但是跟table有个重名的问题
                        'size-change': v => this.$emit('size-change', v),
                        'prev-click': (v) => this.$emit('prev-click', v),
                        'next-click': (v) => this.$emit('next-click', v),
                        'current-change': (v) => this.$emit('page-current-change', v)
                    }
                }
                pageChild = <page page={this.page} {...pageArgs} class='render-page'/>
            }
        }
        return (
            <div class="table-wrapper">
                <div class='render-table'>
                    <Table {...tableArgs} height='100%'>
                        {children}
                    </Table>
                </div>
                {pageChild}
            </div>
        )
    }
}
