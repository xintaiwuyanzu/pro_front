/**
 *抽象父类，用来声明value需要转换显示的参数
 * @type {{props: {}}}
 */
import {reactive, watch, watchEffect} from "vue-demi";
import {useDict} from "../hooks/useDict";
import {getPropByPath} from 'element-ui/src/utils/util';
import {http} from "../plugins/http";
import dayjs from 'dayjs'

export const AbstractMapper = {
    props: {
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
         * 要显示的内容需要把prop的值映射成别的value，mapper是指key、value的数组
         *
         * 当mapper是Object的时候，使用prop的值作为key获取mapper的value作为显示的内容
         * 当mapper是Array的时候，使用prop的值，与mapper的每个对象的mapperKey对比，相同时，取选中对象的mapperLabel属性作为显示的内容
         * 当mapper是Function的时候，调用同步的Function，函数的参数第一个是prop的值、第二个参数是row对象
         *
         */
        mapper: [Object, Array, Function],
        /**
         * 对象value的key
         */
        valueKey: {type: String, default: 'id'},
        /**
         * 对象label的key
         */
        labelKey: {type: String, default: 'label'},
        /**
         *是否多选
         */
        multiple: {type: Boolean, default: false},
        /**
         * 多选分割符
         */
        multipleSplit: {type: String, default: ','},
        /**
         * 异步请求地址
         */
        url: {type: String},
        /**
         * mapper和url异步请求参数
         */
        params: {type: Object, default: () => ({})},
        /**
         * url异步http请求方法
         */
        requestMethod: {type: String, default: 'post'},
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
        showTypeKey: {type: String}

    },
    setup(props) {
        /**
         * 返回结果响应式
         * @type {UnwrapRef<{data: *[], loading: boolean}>}
         */
        let mapperData
        let needWatch = false
        if (props.dictKey) {
            //声明了字典参数
            mapperData = useDict(props.dictKey).dict
        } else if (props.mapper && (Array.isArray(props.mapper) || typeof props.mapper === 'object')) {
            //不是字典
            //声明了mapper参数
            mapperData = reactive({data: props.mapper, loading: false})
            //响应式监听属性
            watch(() => props.mapper, v => mapperData.data = v)
        } else if (props.mapper) {
            //异步获取的数据
            if (props.mapper.then) {
                //异步数据
                needWatch = true
                mapperData = reactive({data: [], loading: false})
            } else {
                //同步数据
                mapperData = reactive({data: props.mapper(props.params), loading: false})
            }
        } else if (props.url) {
            //异步数据
            needWatch = true
            mapperData = reactive({data: [], loading: false})
        }
        if (needWatch) {
            watchEffect(async () => {
                //mapper是异步方法
                let result
                if (props.mapper) {
                    result = await props.mapper(props.params)
                } else if (props.url) {
                    result = await http()[props.requestMethod === 'post' ? 'post' : 'get'](props.url, props.params)
                    result = result.data
                }
                if (result) {
                    if (Object.hasOwnProperty.call(result, 'success')) {
                        mapperData.data = result.data
                    } else {
                        mapperData.data = result
                    }
                }
            })
        }
        /**
         * 真正执行查找方法
         * @param v
         */
        const findValue = (v) => {
            let findV
            if (Array.isArray(mapperData.data)) {
                //数组类型字典
                findV = mapperData.data.find(f => `${getPropByPath(f, props.valueKey).v}` === `${v}`)
            } else {
                //Object类型数据
                findV = mapperData.data[v]
            }
            if (findV) {
                const valueType = typeof findV
                if (valueType === 'string' || valueType === 'number') {
                    return findV
                } else {
                    return getPropByPath(findV, props.labelKey).v
                }
            }
            return v
        }
        /**
         * 简单映射方法，根据value返回映射后的结果
         * @param value
         */
        const simpleMapper = (value) => {
            if (value && mapperData) {
                if (props.multiple) {
                    return value.split(props.multipleSplit).map(findValue)
                } else {
                    return findValue(value)
                }
            } else if (value && props.dateFormat) {
                //没有自定义映射参数，额外定义了日期格式化的参数，尝试使用dayjs格式化日期
                const fmt = (typeof props.dateFormat === 'boolean') ? 'YYYY-MM-DD' : props.dateFormat
                try {
                    return value === 0 ? '-' : dayjs(value).format(fmt)
                } catch (e) {
                    /*eslint-disable-next-line no-console*/
                    console.error(`尝试使用${fmt}格式化日期数据：${value}失败`, e)
                }
            }
            return value
        }
        /**
         * 获取显示类型
         * @param findv
         * @param value
         * @param mapperValue
         * @param page
         * @param index
         * @param row
         * @return {String|Object|Function|*}
         */
        const getShowType = (findv, value, mapperValue, page, index, row) => {
            if (props.showTypeKey) {
                return getPropByPath(findv, props.showTypeKey).v
            } else if (props.dictKey) {
                return getPropByPath(findv, 'data.showType').v
            } else if (props.showTypeMapper) {
                const type = typeof props.showTypeMapper
                if (type === 'object') {
                    //显示类型映射为字典时，尝试根据value和mapperValue获取显示类型
                    return getPropByPath(props.showTypeMapper, `${value}`).v || getPropByPath(props.showTypeMapper, `${mapperValue}`).v
                } else if (type === 'function') {
                    return props.showTypeMapper(value, row, page ? (page.index - 1) * page.size + index + 1 : index + 1)
                } else if (type === 'string') {
                    return props.showTypeMapper
                }
            }
        }

        const findValueWithShowType = (v, row, page, index) => {
            let showType = 'info'
            let findV
            if (Array.isArray(mapperData.data) && mapperData.data.length > 0) {
                //数组类型字典
                findV = mapperData.data.find(f => `${getPropByPath(f, props.valueKey).v}` === `${v}`)
            } else {
                //Object类型数据
                findV = mapperData.data[v]
            }
            if (findV) {
                const valueType = typeof findV
                if (valueType === 'string' || valueType === 'number') {
                    return {value: findV, showType}
                } else {
                    const value = getPropByPath(findV, props.labelKey).v
                    return {value, showType: getShowType(findV, v, value, page, index)}
                }
            }
            return {value: v, showType}
        }
        /**
         * 映射数据并且带有显示类型
         * @param value 数据值
         * @param page 分页数据
         * @param index 当前行
         * @return {{value: *}|{showType: *|String|Object|Function|undefined, value: *}|*}
         */
        const simpleMapperWithShowType = (value, row, page, index, column) => {
            if (value && mapperData) {
                if (props.multiple) {
                    return value.split(props.multipleSplit).map(v => findValueWithShowType(v, row, page, index))
                } else {
                    return findValueWithShowType(value, row, page, index)
                }
            } else if (value && props.dateFormat) {
                //没有自定义映射参数，额外定义了日期格式化的参数，尝试使用dayjs格式化日期
                const fmt = (typeof props.dateFormat === 'boolean') ? 'YYYY-MM-DD' : props.dateFormat
                try {
                    return {value: value === 0 ? '-' : dayjs(value).format(fmt), showType: 'info'}
                } catch (e) {
                    /*eslint-disable-next-line no-console*/
                    console.error(`尝试使用${fmt}格式化日期数据：${value}失败`, e)
                }
            } else if (value && props.formatter) {
                return {value: props.formatter(row, column, value, index), showType: 'info'}
            }
            return {value, showType: 'info'}
        }
        return {
            mapperData,
            simpleMapper,
            simpleMapperWithShowType
        }
    }
}