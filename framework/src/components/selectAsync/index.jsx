import {selectRender} from "./selectUtil";
import {AbstractMapper} from "../../fix/AbstractMapper";

export default {
    inheritAttrs: false,
    name: 'selectAsync',
    extends: AbstractMapper,
    props: {
        value: [String, Number, Array]
    },
    render() {
        return selectRender(this)
    }
}