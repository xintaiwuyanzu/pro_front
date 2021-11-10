<template>
  <section>
    <nac-info title="字典管理">
      <config-form ref="form" @search="loadData"/>
    </nac-info>
    <div class="index_main" v-loading="loading">
      <table-render class="table-container"
                    :columns="columns"
                    :data="data"
                    :page="page"
                    @size-change="s=>this.page.size=s"
                    @page-current-change="p=>this.loadData({pageIndex:p-1})"
                    showPage>
        <el-table-column label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editForm(scope.row)">编 辑</el-button>
            <el-button type="text" size="small" @click="remove(scope.row.id)">删 除</el-button>
          </template>
        </el-table-column>
      </table-render>
    </div>
  </section>
</template>

<script>
import ConfigForm from './form'
import indexMixin from '@dr/auto/lib/util/indexMixin'

export default {
  data() {
    return {
      columns: [
        {prop: 'key', label: '字典编码', align: 'center'},
        {prop: 'value', label: '字典值'},
        {prop: 'description', label: '描述', width: "300"},
        {prop: 'order', label: '排序', width: "80"},
        {prop: 'status', label: '可用', width: "60", dictKey: 'state', component: 'tag'},
      ],
      path: 'sysDict'
    }
  },
  components: {ConfigForm},
  mixins: [indexMixin],
  methods: {
    $init() {
      this.loadData(this.$refs.form?.getSearchForm())
    },
    apiPath() {
      return '/sysDict/'
    }
  }
}
</script>