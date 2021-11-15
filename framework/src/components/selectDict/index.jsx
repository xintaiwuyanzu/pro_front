import {useDict} from "../../hooks/useDict";
import abstractSelect, {selectRender} from "../selectAsync/abstractSelect";

export default {
    name: 'selectDict',
    extends: abstractSelect,
    props: {
        //要渲染的字典的字段
        type: {type: String, require: true}
    },
    setup(prop, context) {
        const {dict} = useDict(prop.type)
        return selectRender(prop, context, dict)
    }
}