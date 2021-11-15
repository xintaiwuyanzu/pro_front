<template>
  <section>
    <nac-info>
      <config-form ref="form" @search="loadData"/>
    </nac-info>
    <div class="index_main" v-loading="loading">
      <table-render class="table-container"
                    :data="data"
                    :columns="columns"
                    :page="page"
                    @size-change="s=>this.page.size=s"
                    @page-current-change="p=>this.loadData({pageIndex:p-1})">
        <el-table-column label="操作" width="80" header-align="center" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="remove(scope.row.id)" v-if="!scope.row.sys">删 除
            </el-button>
          </template>
        </el-table-column>
      </table-render>
    </div>
  </section>
</template>
<script>
import ConfigForm from './form'
import abstractResource from "./abstractResource";
import indexMixin from '@dr/auto/lib/util/indexMixin'

export default {
  extends: abstractResource,
  data() {
    return {
      columns: [
        {prop: "name", label: "权限名称", component: 'text', route: true},
        {prop: "description", label: "权限描述"},
        {prop: "type", label: "权限类型", propMapper: this.getProvideLabel}
      ],
      path: '/sysPermission/'
    }
  },
  components: {ConfigForm},
  mixins: [indexMixin],
  methods: {
    async $init() {
      await this.loadResourceProvider()
      await this.loadData()
    }
  }
}
</script>
