import {AbstractMapper} from "../../fix/AbstractMapper";
import {Checkbox, CheckboxGroup} from "element-ui";
import {selectMap} from "../selectAsync/selectUtil";

/**
 * radio单选分组功能
 */
export default {
    name: 'checkBoxAsync',
    extends: AbstractMapper,
    inheritAttrs: false,
    props: {
        value: {
            default: () => {
                return []
            }
        }
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
        const children = selectMap(this).map(({label, value}) => <Checkbox label={value}>{label}</Checkbox>)
        return (
            <CheckboxGroup {...groupArgs}>
                {children}
            </CheckboxGroup>
        )
    }
}