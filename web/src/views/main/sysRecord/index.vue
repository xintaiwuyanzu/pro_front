<template>
    <section v-loading="loading">
        <nac-info>
        </nac-info>
        <div class="index_main">
            <log-form ref="form" v-if="showSearch"/>
            <div class="table-container">
                <el-table :data="data"  border height="100%"  >
                    <el-table-column label="排序" type="index" align="center">
                        <template slot-scope="scope">
                            {{(page.index-1)*page.size+scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="person" label="操作人" align="center" header-align="center">
                    </el-table-column>
                    <el-table-column prop="logtype" label="操作类型" align="center" header-align="center">
                    </el-table-column>
                    <el-table-column prop="remark" label="描述" align="center" header-align="center"
                                     show-overflow-tooltip/>
                    <el-table-column prop="createDate" label="时间" align="center" header-align="center"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.createDate|date}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="filed1" label="data1" align="center" header-align="center"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="filed2" label="data2" align="center" header-align="center"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="filed3" label="data3" align="center" header-align="center"
                                     show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    @current-change="index=>loadData({pageIndex:index-1})"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    layout="total, prev, pager, next"
                    :total="page.total">
            </el-pagination>
        </div>
    </section>
</template>
<script>
    import indexMixin from '@/util/indexMixin'
    import log from './form'
    export default {
        mixins: [indexMixin],
        components: {log},
        data() {
            return {
                data: [],
                loading: false,
                searchForm: {},
                timevalue: [],
                dict: ['organise', 'recode.type']
            }
        },
        methods: {
            $init() {
                this.loadData()
            },

        }
    }
</script>
