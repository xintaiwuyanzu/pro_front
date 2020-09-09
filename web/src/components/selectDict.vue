<template>
    <el-select :value="id" style="width: 100%" :placeholder="placeholder" @change="change" clearable filterable
               :disabled="disabled">
        <el-option
                v-for="item in dicts"
                :key="item.id"
                :label="item.label"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: {
            type: {type: String, required: true},
            id: {type: String},
            placeholder: {type: String},
            disabled: {type: Boolean, default: false}
        },
        model: {event: 'selected', prop: 'id'},
        data() {
            return {dicts: []}
        },
        methods: {
            change(v) {
                this.$emit('selected', v)
            }
        },
        mounted() {
            if (this.type) {
                this.$loadDict(this.type).then(dict => {
                    this.dicts = dict
                })
            }
        }
    }
</script>
