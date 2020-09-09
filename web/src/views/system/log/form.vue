<template>
    <section>
        <el-form :model="searchForm" ref="searchForm" inline class="searchForm">
            <el-form-item label="操作人：" prop="person">
                <el-input v-model="searchForm.person" placeholder="请输入操作人编码" clearable/>
            </el-form-item>
            <el-form-item label="操作对象：" prop="perated">
                <el-input v-model="searchForm.perated" placeholder="请输入操作对象" clearable/>
            </el-form-item>
            <el-form-item label="操作结果：" prop="logresult">
                <el-input v-model="searchForm.logresult" placeholder="请输入操作结果" clearable/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" size="mini">搜 索</el-button>
                <el-button @click="$refs.searchForm.resetFields()" size="mini">重 置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button @click="expLog" size="mini" type="primary">导出EXCEL</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import fromMixin from '@/util/formMixin'


    export default {
        mixins: [fromMixin],
        components: {},
        data() {
            return {
                searchForm: {
                    person: '',
                    logresult: '',
                    perated: ''
                },
            }
        },
        filters: {},
        methods: {


            $init() {
            },
            expLog() {
                let url = "api/gestion/expLog"
                console.log(url)
                window.open(url)
            }
        }
    }
</script>
