import {Card} from "element-ui";
import {makeArray} from "../tableRender/utils";
import {fieldRender} from "./fieldRender";

/**
 * 渲染容器
 * @param props
 * @param context
 * @param vSlots
 * @returns {JSX.Element}
 */
export const containerRender = (props, context, vSlots) => {
    //声明的children
    const containerChild = renderObject(props.children, context, vSlots)
    //手写的
    const containerSlots = vSlots.getGroup(props.prop)
    return (
        <Card header={props.header} shadow='never'>
            {containerChild}
            {containerSlots}
        </Card>
    )
}
/**
 * 渲染对象
 * @param fields
 * @param context
 * @param vSlots
 * @returns {*}
 */
export const renderObject = (fields = [], context, vSlots) => {
    return makeArray(fields).filter(f => f.show || f.show === undefined)
        .reduce((resultArr, props) => resultArr.concat(vSlots.getField(props, props => {
            //判断字段类型，选择组件
            const fieldType = props.fieldType || 'input'
            if (fieldType === 'object') {
                return containerRender(props, context, vSlots)
            } else {
                return fieldRender(fieldType, props, context)
            }
        })), [])
}