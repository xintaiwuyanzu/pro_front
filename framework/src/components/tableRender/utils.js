const getProps = vNode => vNode.componentOptions ? vNode.componentOptions.propsData : vNode.asyncMeta.data.props
/**
 * 将对象转换为数组类型
 * @param arr
 * @return {*[]}
 */
export const makeArray = (arr) => {
    let result = arr || []
    if (!Array.isArray(arr) && typeof arr === 'object') {
        result = []
        Object.keys(arr).forEach(key => result.push({prop: key, ...arr[key]}))
    }
    return result
}
/**
 *代理方法
 * @param refId
 * @param functionArr
 * @returns {*}
 */
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
 * 用来过滤排序slots
 */
export class vNodeSlots {
    /**
     * @param slots 所有的slots
     * @param firstSelect 第一个选择器
     * @param lastSelect 最后一个选择器
     */
    constructor(slots, firstSelect = () => false, lastSelect = () => false) {
        //所有组件的key，用来后面过滤使用
        this._props = []
        //前面的slot，key是prop，value是数组
        this._before = {}
        //后面的slot
        this._after = {}
        //分组
        this._group = {}
        //最前排的数组
        this._first = []
        //默认数组
        this._default = {$default: []}
        //最后面的数组
        this._latest = []
        if (slots && slots.length > 0) {
            slots.forEach(vNode => {
                const props = getProps(vNode)
                if (props) {
                    const prop = props.prop
                    if (prop) {
                        //有prop属性
                        this._props.push(prop)
                        if (vNode.data && vNode.data.attrs) {
                            const attrs = vNode.data.attrs
                            if (attrs.before) {
                                const beforeKey = attrs.before
                                const arrs = this._before[beforeKey] = this._before[beforeKey] || []
                                arrs.push(vNode)
                                return
                            } else if (attrs.after) {
                                const afterKey = attrs.after
                                const arrs = this._after[afterKey] = this._after[afterKey] || []
                                arrs.push(vNode)
                                return
                            } else if (attrs.group) {
                                const groupKey = attrs.group
                                const arrs = this._group[groupKey] = this._group[groupKey] || []
                                arrs.push(vNode)
                                return
                            }
                        } else if (firstSelect(vNode, props)) {
                            this._first.push(vNode)
                            return
                        } else if (lastSelect(vNode, props)) {
                            this._latest.push(vNode)
                            return
                        }
                        this._default[prop] = vNode
                        return
                    }
                }
                this._default.$default.push(vNode)
            })
        }
    }

    getGroup(groupName) {
        return this._group[groupName] || []
    }

    getField(field, defaultCallBack) {
        const prop = field.prop
        let result = []
        if (this._before[prop]) {
            result = result.concat(this._before[prop])
        }
        if (this._props.includes(prop)) {
            //删除数组
            this._props.splice(this._props.indexOf(prop), 1)
            result.push(this._default[prop])
        } else {
            result.push(defaultCallBack(field))
        }
        if (this._after[prop]) {
            result = result.concat(this._after[prop])
        }
        return result
    }

    /**
     *获取第一个数组
     * @returns {[]}
     */
    getFirst() {
        return this._first
    }

    /**
     * 获取最后的数据
     * @returns {[]}
     */
    getLast() {
        return this._latest
    }

    getDefault() {
        return this._props.map(p => this._default[p]).concat(this._default.$default);
    }
}
