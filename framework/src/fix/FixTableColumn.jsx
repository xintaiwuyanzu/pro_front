import {AbstractMapper} from "./AbstractMapper";
import {getPropByPath} from 'element-ui/src/utils/util';
import {cellForced} from 'element-ui/packages/table/src/config'
import {TableColumn} from 'element-ui'

/**
 * 状态列，用来辅助渲染列表
 */
export default {
    name: 'ElTableColumn',
    extends: TableColumn,
    mixins: [AbstractMapper],
    props: {
        /**
         * 渲染组件类型 tag link button text
         */
        component: {type: String},
        //下面是控件类型为text需要传的属性
        /**
         * 类型为text的时候是否自动跳转
         */
        route: {type: Boolean, default: false},
        /**
         * 当类型是text的时候,跳转路由路径，默认是当前路由的的edit
         */
        routerPath: {type: String},
        /**
         * 当类型是text的时候，跳转路由查询参数的key
         */
        queryProp: {type: String, default: 'id'},
        //text属性完毕
        /**
         * 分页参数，分页组件和index组件用到了
         * 如果分页参数不为空，则自动添加index和分页组件
         */
        page: {type: Object}
    },
    methods: {
        /**
         * 这里覆盖了element的默认写法，增加自定义特性
         * @param column
         * @returns {*}
         */
        setColumnForcedProps(column) {
            if (this.page && !column.property) {
                //TODO 有分页属性的就是index类型的列表，这里有点太武断了
                column.type = 'index'
                if (!column.width) {
                    column.width = column.realWidth = column.minWidth = 48
                }
                if (!column.label) {
                    column.label = '序号'
                }
                if (!column.align) {
                    column.align = 'is-center'
                }
            }
            // 对于特定类型的 column，某些属性不允许设置
            const type = column.type
            const source = cellForced[type] || {}
            Object.keys(source).forEach(prop => {
                let value = source[prop]
                if (value !== undefined) {
                    column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value
                }
            })
            if (column.type === "index" && this.page) {
                //处理带分页的索引
                this.fixIndexPage(column)
            } else if (column.type === 'default') {
                //处理字典映射
                this.fixColumn(column)
            }
            return column
        },
        fixIndexPage(column) {
            //处理带分页的索引
            column.renderCell = (h, {$index, column}) => {
                let i = $index + 1;
                const index = column.index;
                if (typeof index === 'number') {
                    i = $index + index;
                } else if (typeof index === 'function') {
                    i = index($index);
                } else if (this.page && this.page.index && this.page.size) {
                    i = (this.page.index - 1) * this.page.size + $index + 1
                }
                return <div>{i}</div>;
            }
        },
        fixColumn(column) {
            column.renderCell = (h, {$index, row, column}) => {
                const property = column.property;
                const value = property && getPropByPath(row, property).v;
                const valueWithShowType = this.simpleMapperWithShowType(value, row, this.page, $index, column)
                let renderValue
                if (Array.isArray(valueWithShowType)) {
                    renderValue = valueWithShowType.map(v => v.value).join(this.multipleSplit)
                } else {
                    renderValue = valueWithShowType.value
                }
                if (this.component) {
                    if (this.component === 'text') {
                        const on = {}
                        if (this.route) {
                            const query = {}
                            query[this.queryProp] = row[this.queryProp]
                            on.click = () => this.$router.push({
                                path: this.routerPath || `${this.$route.path}/edit`,
                                query
                            })
                        }
                        return (<el-button type='text'{...{on}}>{renderValue}</el-button>)
                    } else {
                        if (Array.isArray(valueWithShowType)) {
                            switch (this.component) {
                                case 'tag':
                                    return valueWithShowType.map(
                                        v => <el-tag type={v.showType}>{v.value}</el-tag>
                                    )
                                case 'link':
                                    return valueWithShowType.map(
                                        v => <el-link type={v.showType}>{v.value}</el-link>
                                    )
                                case 'button':
                                    return valueWithShowType.map(
                                        v => <el-button type={v.showType}>{v.value}</el-button>
                                    )
                            }
                        } else {
                            switch (this.component) {
                                case 'tag':
                                    return (<el-tag type={valueWithShowType.showType}>{renderValue}</el-tag>)
                                case 'link':
                                    return (<el-link type={valueWithShowType.showType}>{renderValue}</el-link>)
                                case 'button':
                                    return (<el-button type={valueWithShowType.showType}>{renderValue}</el-button>)
                            }
                        }
                    }
                }
                return renderValue
            }
        }
    }
}