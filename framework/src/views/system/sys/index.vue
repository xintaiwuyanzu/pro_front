<template>
  <section>
    <nac-info>
      <config-form ref="form" @search="loadData"/>
    </nac-info>
    <div class="index_main" v-loading="loading">
      <div class="table-container">
        <el-table :data="data" border height="100%" @selection-change="handleTableSelect">
          <el-table-column label="排序" type="index" align="center"/>
          <el-table-column prop="sysName" label="系统名称" header-align="center" align="center" show-overflow-tooltip/>
          <el-table-column prop="sysDescription" label="系统描述" align="center" header-align="center"
                           show-overflow-tooltip/>
          <el-table-column label="操作" width="120" header-align="center" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editForm(scope.row)">编 辑</el-button>
              <el-button type="text" size="small" @click="remove(scope.row.id)" v-if="scope.row.id!=='default'">删 除
              </el-button>
            </template>
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
import ConfigForm from './form'
import indexMixin from '@dr/auto/lib/util/indexMixin'

export default {
  data() {
    return {
      path: '/subsys/',
      dict: ['state']
    }
  },
  components: {ConfigForm},
  mixins: [indexMixin],
  methods: {
    $init() {
      this.loadData(this.$refs.form.getSearchForm())
    }
  }
}
</script>
