import {useDict} from "../hooks/useDict";
import {getPropByPath} from 'element-ui/src/utils/util';
import {cellForced} from 'element-ui/packages/table/src/config'
import {TableColumn} from 'element-ui'
import dayjs from 'dayjs'

/**
 * 状态列，用来辅助渲染列表
 */
export default {
    extends: TableColumn,
    props: {
        /*
         * ================================
         * 下面是映射相关属性
         * ================================
         */
        /**
         * 对应的字典编码
         */
        dictKey: {type: String},
        /**
         * 数据内容为日期，这里传入日期格式化编码
         */
        dateFormat: [Boolean, String],
        /**
         * 字段映射属性，指定的prop的值，是字典或者id的时候，
         * 要显示的内容需要把prop的值映射成别的value，propMapper是指key、value的数组
         *
         * 当propMapper是Object的时候，使用prop的值作为key获取propMapper的value作为显示的内容
         * 当propMapper是Array的时候，使用prop的值，与propMapper的每个对象的mapperKey对比，相同时，取选中对象的mapperLabel属性作为显示的内容
         * 当propMapper是Function的时候，调用同步的Function，函数的参数第一个是prop的值、第二个参数是row对象
         *
         */
        propMapper: [Object, Array, Function],
        /**
         * prop的显示内容映射对应的key，与propMapper配合使用
         */
        mapperKey: {type: String, default: 'id'},
        /**
         * prop的显示内容映射对应的label，与propMapper配合使用
         */
        mapperLabel: {type: String, default: 'label'},
        /*
         * ================================
         * 下面是渲染相关属性
         * ================================
         */
        /**
         * 渲染组件类型 tag link button text
         */
        component: {type: String},
        /**
         * 控件显示类型，映射
         * String类型的时候，直接使用给定的值作为显示类型
         * Object类型的时候：状态映射 key是字段值，value是样式
         * Function同步函数，类型的时候，Function有三个参数 propValue:属性对应的值，row:一行数据对象，index：索引号，当page存在时，会计算全局的index
         */
        showTypeMapper: [String, Object, Function],
        /**
         * 当showTypeMapper是Array的时候，可以从过滤出来的数据中获取控件显示类型属性
         */
        showTypeKey: {type: String},
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
                const {renderValue, componentShowType} = this.computeRenderValueAndShowType(value, row, column, $index)
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
                        switch (this.component) {
                            case 'tag':
                                return (<el-tag type={componentShowType}>{renderValue}</el-tag>)
                            case 'link':
                                return (<el-link type={componentShowType}>{renderValue}</el-link>)
                            case 'button':
                                return (<el-button type={componentShowType}>{renderValue}</el-button>)
                            case 'text':
                        }
                    }
                }
                return (renderValue)
            }
        },
        /**
         * 计算出来要渲染的值
         * @param value prop对应的value
         * @param row 一行的数据
         * @param column 列定义
         * @return
         */
        computeRenderValueAndShowType(value, row, column, $index) {
            let renderValue = value
            let componentShowType = 'info'
            const propMapper = this.propMapper || (this.dictData ? this.dictData.data : null)
            if (Array.isArray(propMapper)) {
                //属性映射是数组类型
                const findV = propMapper.find(d => `${getPropByPath(d, this.mapperKey).v}` === `${value}`)
                if (findV) {
                    renderValue = getPropByPath(findV, this.mapperLabel).v
                    let showTypeKey = this.showTypeKey
                    if (!showTypeKey && this.dictData) {
                        //没有声明显示类型的字段，并且是字典类型的时候，可以尝试从字典中获取显示类型
                        showTypeKey = 'data.showType'
                    }
                    if (showTypeKey) {
                        //尝试从映射数据中获取显示类型
                        componentShowType = getPropByPath(findV, showTypeKey).v
                    }
                }
            } else if (typeof propMapper === "function") {
                //属性映射是函数类型
                renderValue = propMapper(value, row)
            } else if (propMapper !== null && typeof propMapper === 'object') {
                //属性映射是Object类型
                renderValue = getPropByPath(propMapper, value).v
            } else if (this.dateFormat) {
                //没有自定义映射参数，额外定义了日期格式化的参数，尝试使用dayjs格式化日期
                const fmt = typeof this.dateFormat === 'boolean' ? 'YYYY-MM-DD' : this.dateFormat
                try {
                    renderValue = dayjs(value).format(fmt)
                } catch (e) {
                    console.error(`尝试使用${fmt}格式化列${column.prop}的日期数据：${value}失败`, e)
                }
            }
            if (this.showTypeMapper) {
                const type = typeof this.showTypeMapper
                if (type === 'object') {
                    //显示类型映射为字典时，尝试根据value和renderValue获取显示类型
                    componentShowType = getPropByPath(this.showTypeMapper, `${value}`).v
                        || getPropByPath(this.showTypeMapper, `${renderValue}`).v
                } else if (type === 'function') {
                    const index = this.page ? (this.page.index - 1) * this.page.size + $index + 1 : $index
                    componentShowType = this.showTypeMapper(value, row, index)
                } else if (type === 'string') {
                    componentShowType = this.showTypeMapper
                }
            }
            return {renderValue: renderValue || value, componentShowType};
        }
    }
}