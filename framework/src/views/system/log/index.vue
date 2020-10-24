<template>
    <section>
        <nac-info>
        </nac-info>
        <div class="index_main" v-loading="loading">
            <reader-form ref="form" v-if="showSearch"/>
            <div class="table-container">
                <el-table :data="data" border height="100%" @selection-change="handleTableSelect">
                    <el-table-column label="排序" fixed align="center" width="50">
                        <template slot-scope="scope">
                            {{(page.index-1)*page.size+scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" width="100" align="center">
                        <template slot-scope="scope">
                            {{scope.row.person}}
                        </template>
                    </el-table-column>
                    <el-table-column label="日志操作类型" prop="logtype" width="120" align="center" show-overflow-tooltip/>
                    <el-table-column label="操作对象" prop="perated" width="180" align="center" show-overflow-tooltip/>
                    <el-table-column label="日志描述" prop="remark" align="center" show-overflow-tooltip/>
                    <el-table-column label="涉及金额" prop="money" width="80" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.money=='-'?'-':scope.row.money/100}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作结果"  width="80" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.logresult=='200'?'成功':scope.row.logresult}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人" prop="createPerson" width="120" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createPerson|selectPerson}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" header-align="center" width="150" align="center"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.createDate|datetime}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    @current-change="index=>loadData({pageIndex:index-1},$refs.form.getSearchForm())"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    layout="total, prev, pager, next"
                    :total="page.total">
            </el-pagination>
        </div>
    </section>
</template>
<script>
    import indexMixin from '@dr/auto/lib/util/indexMixin'
    import readerForm from './form'
let persons = []
    export default {
        mixins: [indexMixin],
        components: {readerForm},
        data() {
            return {
                loading:false
            }
        },
        filters:{
            selectPerson(id){
                if (id) {
                    let person = persons.find(val => val.id === id)
                    if (person) {
                        return person.userName
                    }
                }
            }
        },
        methods: {
            $init() {
                this.loadData()
            },
            loadData (params, useSearchForm) {
                this.loading = true
                if (useSearchForm && this.$refs.form && this.$refs.form.getSearchForm) {
                    params = this.$refs.form.getSearchForm(params)
                }
                this.$http.post('/sysRecord/page', params).then(({data}) => {
                    if (data && data.success) {
                        this.data = data.data.data
                        this.page.index = data.data.start / data.data.size + 1
                        this.page.size = data.data.size
                        this.page.total = data.data.total
                        if(this.$refs.form){
                            this.$refs.form.searchForm = Object.assign(this.$refs.form.searchForm,{pageIndex:this.page.index-1})
                        }
                    }
                    this.loading = false
                })
            },
        },
        mounted() {
            this.$http.post('/person/page?page=false')
                .then(({data}) => {
                    if (data.success) {
                        persons = data.data
                    }
                })
        }
    }
</script>
