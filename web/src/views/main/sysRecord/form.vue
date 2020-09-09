<template>
    <section>
        <el-form :model="searchForm" ref="searchForm" inline class="searchForm">
            <el-form-item label="操作人：">
                <el-input v-model="searchForm.person" clearable placeholder="请输入操作人"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" size="mini">搜 索</el-button>
                <el-button @click="$refs.searchForm.resetFields()">重 置</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import fromMixin from '@/util/formMixin'

    export default {
        mixins: [fromMixin],
        data() {
            return {
                searchForm: {person:''},
            }
        }

    }
</script>

<style scoped>
    /* */
</style>