<template>
    <table-index path="sysDict"
                 :fields=fields
                 :defaultInsertForm=defaultInsertForm>
    </table-index>
</template>

<script>
/**
 * 字典模块
 */
export default {
    role: ['admin'],
    data() {
        return {
            fields: [
                {prop: 'key', label: '字典编码', align: 'center', search: true, required: true},
                {prop: 'value', label: '字典值', required: true},
                {prop: 'description', label: '描述', width: "300", type: 'textarea'},
                {prop: 'order', label: '排序', width: "80", type:'number'},
                {
                    prop: 'status',
                    label: '是否可用',
                    width: "80",
                    showTypeKey: 'showType',
                    mapper: {
                        1: {label: '是', showType: 'success'},
                        0: {label: '否', showType: 'info'}
                    },
                    fieldType: 'select',
                    component: 'tag'
                }
            ],
            defaultInsertForm: {status: '1'}
        }
    },
    // render() {
    //     return <table-index path="sysDict" fields={this.fields} defaultInsertForm={this.defaultInsertForm}/>
    // }
}
</script>

<style scoped>
/deep/.el-select {
    display: block;
}
</style>