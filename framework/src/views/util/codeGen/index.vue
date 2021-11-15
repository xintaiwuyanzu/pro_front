<template>
  <section>
    <nac-info>
      <el-button type="primary" @click="showwSourceDialog">生成实体类</el-button>
      <el-button type="primary">前端代码</el-button>
      <el-switch active-text="所有表" inactive-text="已配置表"
                 active-value="true" inactive-value="false"
                 v-model="withDabatase"/>
    </nac-info>
    <div class="index_main" style="flex-direction: row">
      <div class="tree-container">
        <el-input placeholder="输入中英文关键字进行过滤" v-model="filterText" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-tree ref="tableTree" :data="tree" v-loading="treeLoading"
                 @node-click="nodeClick" show-checkbox
                 :filter-node-method="filterNode" default-expand-all>
        </el-tree>
      </div>
      <div class="table-container">
        <el-table v-loading="tableLoading" :data="columns" height="100%">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="备注" prop="remarks"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="生成实体类" width="90%" :visible.sync="sourceDialog">
      <el-form :model="sourceForm" label-width="80px" ref="sourceForm">
        <el-form-item label="相对路径" prop="path" required>
          <el-input v-model="sourceForm.path" clearable/>
        </el-form-item>
        <el-form-item label="模块" prop="module" required>
          <el-input v-model="sourceForm.module" clearable/>
        </el-form-item>
        <el-form-item label="包名" prop="packageName" required>
          <el-input v-model="sourceForm.packageName" clearable/>
        </el-form-item>
        <el-table :data="sourceForm.tables" height="250px">
          <el-table-column label="表名" prop="tableName"/>
          <el-table-column label="包名" prop="tableName">
            <template>
              {{ sourceForm.packageName }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remarks">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remarks"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="实体类名" prop="entityName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.entityName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini"
                         @click="sourceForm.tables=sourceForm.tables.filter(t=>t.tableName!==scope.row.tableName)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sourceDialog=false">取 消</el-button>
        <el-button type="primary" @click="genSource" :loading="sourceDialogLoading">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
    return {
      withDabatase: false,
      filterText: '',
      treeLoading: false,
      tree: [],
      tableLoading: false,
      columns: [],
      sourceDialog: false,
      sourceDialogLoading: false,
      sourceForm: {
        datasource: '',
        path: '',
        packageName: '',
        module: '',
        tables: []
      }
    }
  },
  watch: {
    filterText(v) {
      this.$refs.tableTree.filter(v)
    },
    withDabatase() {
      this.loadTree()
    }
  },
  methods: {
    genSource() {
      this.$refs.sourceForm.validate(valid => {
        if (valid) {
          sessionStorage.setItem('gencode', JSON.stringify({
            path: this.sourceForm.path,
            packageName: this.sourceForm.packageName,
            module: this.sourceForm.module
          }))
          this.sourceDialogLoading = true
          this.$http.post('/codeGen/genSource', this.sourceForm)
              .then(({data}) => {
                let message = data.data.map(d => '<strong>' + d + '</strong>').join('<br>')
                this.$message({
                  dangerouslyUseHTMLString: true,
                  message: message
                })
                this.sourceDialogLoading = false
              })
        }
      })
    },
    showwSourceDialog() {
      let nodes = this.$refs.tableTree.getCheckedNodes().filter(n => n.parentId === 'database')
      if (nodes.length === 0) {
        this.$message.error('请选择未配置的表名')
        return
      }
      let halfChecked = this.$refs.tableTree.getHalfCheckedNodes().filter(n => n.id !== 'database')
      if (halfChecked.length !== 1) {
        this.$message.error('请选择单个数据源操作')
        return
      }
      this.sourceForm = Object.assign(this.sourceForm, JSON.parse(sessionStorage.getItem('gencode')))
      this.sourceForm.datasource = halfChecked[0].id
      this.sourceForm.tables = nodes.map(n => {
        return {
          remarks: n.label,
          tableName: n.id,
          entityName: n.id
        }
      })
      this.sourceDialog = true
    },
    nodeClick(data, node) {
      if (node.level === 3) {
        this.tableLoading = true
        this.$post('/codeGen/columns', {dataSource: node.parent.parent.data.id, tableName: node.data.id})
            .then(({data}) => {
              if (data.success) {
                this.columns = data.data
              } else {
                this.$message.error(data.message)
              }
              this.tableLoading = false
            })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      value = value.toLowerCase()
      return data.label.toLowerCase().indexOf(value) !== -1 || data.id.toLowerCase().indexOf(value) !== -1
    },
    loadTree() {
      this.treeLoading = true
      this.$http.post('/codeGen/tableTree', {withDabatase: this.withDabatase})
          .then(({data}) => {
                if (data.success) {
                  this.tree = data.data
                } else {
                  this.$message.error('加载数据库信息失败：' + data.message)
                }
                this.treeLoading = false
              }
          )
    }
  },
  mounted() {
    this.loadTree()
  }
}
</script>
<style scoped lang="scss">
.index_main {
  .tree-container {
    display: flex;
    width: 200px;
    flex-direction: column;
    overflow: auto;
    padding: 10px;

    .el-input {
      margin-bottom: 5px;
    }

    .el-tree {
      flex: 1;
      overflow: auto;
    }

  }

  .table-container {
    flex: 1;
  }

}
</style>
