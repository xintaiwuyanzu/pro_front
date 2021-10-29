import ELFormItem from 'element-ui/packages/form/src/form-item'
import AsyncValidator from 'async-validator';

const messages = {
    "default": '%s校验失败',
    required: '%s不能为空',
    "enum": '%s只能是以下值%s',
    whitespace: '%s不能为空',
    date: {
        format: '%s日期值%s格式不符合%s',
        parse: '%s日期值解析失败, %s格式不正确',
        invalid: '%s日期值%s格式不正确'
    },
    types: {
        string: '%s不是字符类型',
        method: '%s不是函数类型',
        array: '%s不是数组类型',
        object: '%s不是对象类型',
        number: '%s不是数字类型',
        date: '%s不是日期类型',
        "boolean": '%s不是布尔类型',
        integer: '%s不是整数类型',
        "float": '%s不是浮点数字类型',
        regexp: '%s不是正则类型',
        email: '%s不是邮箱类型',
        url: '%s不是url类型',
        hex: '%s不是16进制'
    },
    string: {
        len: '%s长度只能是%s',
        min: '%长度至少是%s',
        max: '%长度不得超过%s',
        range: '%长度只能在%s和%s之间'
    },
    number: {
        len: '%s长度只能是%s',
        min: '%长度至少是%s',
        max: '%长度不得超过%s',
        range: '%长度只能在%s和%s之间'
    },
    array: {
        len: '%s只能选择%s项',
        min: '%s数量至少为%s个',
        max: '%s数量不得大于%s个',
        range: '%范围数量只能在%s和%s之间'
    },
    pattern: {
        mismatch: '%s值%s格式不匹配%s'
    },
    clone: function clone() {
        let cloned = JSON.parse(JSON.stringify(this));
        cloned.clone = this.clone;
        return cloned;
    }
}
/**
 * 这里所有代码都是从element-ui/packages/form/src/form-item复制出来的
 * 只是添加了校验消息转中文的相关代码，将来升级包的时候需要注意更新最新代码
 */

export default {
    name: ELFormItem.name,
    componentName: ELFormItem.componentName,
    extends: ELFormItem,
    methods: {
        validate(trigger, callback) {
            this.validateDisabled = false;
            const rules = this.getFilteredRule(trigger);
            if ((!rules || rules.length === 0) && this.required === undefined) {
                callback();
                return true;
            }
            this.validateState = 'validating';
            const descriptor = {};
            if (rules && rules.length > 0) {
                rules.forEach(rule => {
                    let label = this.label
                    if (label && (label.endsWith(':') || label.endsWith('：'))) {
                        label = label.substr(0, label.length - 1)
                    }
                    //这里改了
                    rule.fullField = label
                    if (!rule.type) {
                        try {
                            //TODO 字段格式类型 详情参考async-validator getType方法
                            const fieldValue = this.fieldValue
                            if (fieldValue !== null && fieldValue !== undefined) {
                                //这里获取类型太暴力了 所有校验类型为  string  number boolean method  regexp integer  float array object enum  date  url hex email any
                                rule.type = typeof fieldValue
                            }
                        } catch (e) {
                            console.warn(`设置字段${this.prop}数据类型失败`, e)
                        }
                    }
                    delete rule.trigger;
                });
            }
            descriptor[this.prop] = rules;
            const validator = new AsyncValidator(descriptor);
            const model = {};
            model[this.prop] = this.fieldValue;
            //这里添加了messages
            validator.validate(model, {firstFields: true, messages}, (errors, invalidFields) => {
                this.validateState = !errors ? 'success' : 'error';
                this.validateMessage = errors ? errors[0].message : '';
                if (callback) {
                    callback(this.validateMessage, invalidFields);
                }
                this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
            });
        }
    }
}