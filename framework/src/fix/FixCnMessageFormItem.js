/* eslint-disable */
import ELFormItem from 'element-ui/packages/form/src/form-item'

export default {
    name: ELFormItem.name,
    componentName: ELFormItem.componentName,
    extends: ELFormItem,
    methods: {
        /**
         * 这里补全校验消息，基本校验消息更改为中文
         * @param trigger
         */
        getFilteredRule(trigger) {
            const rules = this.getRules();
            const result = rules.filter(rule => {
                if (!rule.trigger || trigger === '') return true;
                if (Array.isArray(rule.trigger)) {
                    return rule.trigger.indexOf(trigger) > -1;
                } else {
                    return rule.trigger === trigger;
                }
            }).map(rule => objectAssign({}, rule));
            console.log(result)
            return result;
        }
    }
}