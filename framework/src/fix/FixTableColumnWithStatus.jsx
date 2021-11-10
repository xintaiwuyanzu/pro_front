import {useDict} from "../hooks/useDict";
import {getPropByPath} from 'element-ui/src/utils/util';
import tableColumn from 'element-ui/lib/table-column'
import {cellForced} from 'babel-loader!element-ui/packages/table/src/config'

/**
 * 状态列，用来辅助渲染列表
 */
export default {
    extends: tableColumn,
    props: {
        //对应的字典
        dictKey: {type: String},
        /**
         * 状态映射 key是字段值，value是样式
         */
        mapper: {type: Object, default: () => ({})},
        /**
         * 渲染组件类型 tag link button text
         */
        component: {type: String},
        /**
         * 分页属性
         */
        page: {type: Object}
    },
    setup: (prop) => {
        if (prop.dictKey) {
            const {dict} = useDict(prop.dictKey)
            return {dictData: dict}
        }
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
            } else if (column.type === 'default' && this.dictKey && this.dictData) {
                //处理字典映射
                this.fixDictColumn(column)
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
        fixDictColumn(column) {
            //处理字典映射
            column.renderCell = (h, {row, column}) => {
                const property = column.property;
                const value = property && getPropByPath(row, property).v;

                //字典可能自带了显示样式
                let dictShowType = null
                let dictValue = null
                if (this.dictData && this.dictData.data) {
                    const findV = this.dictData.data.find(d => `${d.id}` === `${value}`)
                    if (findV) {
                        dictValue = findV.label
                        dictShowType = findV.data.showType
                    }
                }
                const renderValue = dictValue || value
                if (this.component) {
                    const componentShowType = this.mapper[`${value}`]
                        || this.mapper[`${dictValue}`]
                        || dictShowType || 'info'
                    switch (this.component) {
                        case 'tag':
                            return (<el-tag type={componentShowType}>{renderValue}</el-tag>)
                        case 'link':
                            return (<el-link type={componentShowType}>{renderValue}</el-link>)
                        case 'button':
                            return (<el-button type={componentShowType}>{renderValue}</el-button>)
                        case 'text':
                            return (<el-button type='text'>{renderValue}</el-button>)
                    }
                }
                return (renderValue)
            }
        }
    }
}