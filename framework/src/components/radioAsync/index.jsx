import {AbstractMapper} from "../../fix/AbstractMapper";
import {Radio, RadioGroup} from "element-ui";
import {selectMap} from "../selectAsync/selectUtil";

/**
 * radio单选分组功能
 */
export default {
    name: 'radioAsync',
    extends: AbstractMapper,
    inheritAttrs: false,
    props: {
        value: {}
    },
    render() {
        const groupArgs = {
            props: {
                ...this.$attrs,
                value: this.value,
            },
            on: {
                ...this.$listeners,
                input: (v) => this.$emit('input', v)
            },
            directives: [{name: 'loading', value: this.mapperData.loading, modifiers: {fullscreen: true}}]
        }
        const children = selectMap(this).map(({label, value}) => <Radio label={value}>{label}</Radio>)
        return (
            <RadioGroup {...groupArgs}>
                {children}
            </RadioGroup>
        )
    }
}