<template>
  <section class="system_person_id">
    <nac-info>
      <config-form ref="form"
                   @func="getMsgFromForm"
                   :organiseId="organiseId"
                   @getPerson="getPerson"
                   @search="loadData"/>
    </nac-info>
    <div class="index_main card person_main">
      <el-row type="flex">
        <el-col :span="5" style="max-width: 280px">
          <el-card shadow="hover">
            <div slot="header">
              <strong>部门单位</strong>
            </div>
            <el-tree class="sysMenuTree"
                     :data="menuData"
                     default-expand-all
                     @node-click="click"
                     ref="menuTree"
                     style="flex: 1;overflow: auto;">
              <div style="flex: 1;margin: 2px; " slot-scope="{ node, data }">
                <span v-if="organiseId==data.data.id" style=" color: red;font-family: 等线">{{ data.label }}</span>
                <span v-if="organiseId!=data.data.id" style=" color: #409EFF;font-family: 等线">{{ data.label }}</span>
              </div>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-card shadow="hover">
            <div slot="header">
              <strong>人员详情</strong>
            </div>
            <table-render :columns="columns" :data="personData" :page="page">
              <el-table-column label="操作" header-align="center" align="center" width="220">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editForm(scope.row)">编 辑</el-button>
                  <el-button type="text" size="small" @click="removePer(scope.row.id)">删 除
                  </el-button>
                  <el-button type="text" size="small" @click="resetPws(scope.row)">重置密码
                  </el-button>
                  <el-button type="text" size="small" @click="showRole(scope.row)">角色</el-button>
                </template>
              </el-table-column>
            </table-render>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="用户角色" :visible.sync="roleDialogVisible">
      <table-render :columns="roleColumn" :data="roles" height="300px"/>
    </el-dialog>
  </section>
</template>
<script>
import ConfigForm from './form'
import indexMixin from '@dr/auto/lib/util/indexMixin'
import TableRender from "../../../components/tableRender";

export default {
  role: ['admin'],
  components: {TableRender, ConfigForm},
  mixins: [indexMixin],
  data() {
    return {
      userName: "",
      organiseId: "",
      menuData: [],
      loading: false,
      orgName: {},
      personData: [],
      searchForm: {
        userCode: '',
        userName: '',
        mobile: ''
      },
      thisForm: {
        userName: "",
        userCode: "",
        personType: "",
        status: ""
      },
      props: {
        id: 'id',
        label: 'name'
      },
      map22: [],

      defaultcheckarray: [],
      roleTree: [],
      roleDialogVisible: false,
      rolenametitle: '角色列表',
      baseRoleIds: [],
      shouquanuserid: '',
      columns: {
        userName: {label: '用户姓名'},
        userCode: {label: '用户编号'},
        mobile: {label: '手机号'},
        email: {label: '邮箱'},
        sex: {label: '性 别', mapper: {0: '女', 1: '男'}},
      },
      roles: [],
      roleColumn: {
        name: {label: '角色名称', component: 'text', route: true, routerPath: '/system/role/edit'},
        description: {label: '超级管理员'}
      },
      roleDialog: false,
    }
  },
  methods: {
    compare(a, b) {
      let result = new Array();
      let obj = {};
      for (let i = 0; i < a.length; i++) {
        obj[a[i]] = 1;
      }
      for (let j = 0; j < b.length; j++) {
        if (!obj[b[j]]) {
          obj[b[j]] = 1;
          result.push(b[j]);
        }
      }
      return result;
    },
    showquan() {
      let array = this.$refs.roletree.getCheckedNodes()
      if (array.length === 0) {
        this.$message.error('请至少选择一个角色！')
        return
      }
      let array2 = []
      for (let i = 0; i < array.length; i++) {
        array2.push(array[i].id)
      }
      let addRoles = this.compare(this.baseRoleIds, array2)
      let deleteRoles = this.compare(array2, this.baseRoleIds)
      let addids = ''
      let deleteids = ''
      for (let i = 0; i < addRoles.length; i++) {
        addids = addids + addRoles[i] + ','
      }
      for (let i2 = 0; i2 < deleteRoles.length; i2++) {
        deleteids = deleteids + deleteRoles[i2] + ','
      }
      this.$http.post(`/sysrole/addRoleToUser`, {
            addRoleIds: addids,
            delRoleIds: deleteids,
            userId: this.shouquanuserid
          }
      ).then(({data}) => {
        if (data.success) {
          this.roleDialogVisible = false
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
        } else {
          this.$message.error(data.message)
        }
      }).catch(function () {
        this.$message.error('给用户授权时出了点问题...')
      })
    },
    showRoleDialog(row) {
      this.rolenametitle = row.userName
      this.roleDialogVisible = true

      //请求后台，获取菜单权限树
      this.shouquanuserid = row.id
      this.$http.post(`/sysrole/getRoleList`, {userId: row.id}
      ).then(({data}) => {
        if (data.success) {
          this.roleTree = []
          this.roleTree.push(data.data)

          this.defaultcheckarray = []
          this.baseRoleIds = []

          //编辑权限菜单，把原本就选中的加入到数组中
          let checkmenu = data.data.children
          for (let i = 0; i < checkmenu.length; i++) {
            if (checkmenu[i].exist === true) {
              this.baseRoleIds.push(checkmenu[i].id)
              this.defaultcheckarray.push(checkmenu[i].id)
            }
          }
        } else {
          this.$message.error(data.message)
        }
      }).catch(function () {
        this.$message.error('获取角色树时出了点问题...')
      })
    },
    //管理员重置密码
    resetPws(row) {
      this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http.post('/login/resetPassword', {personId: row.id})
            .then(({data}) => {
              if (data.success) {
                this.$alert(data.data, {title: '提示'});
              } else {
                this.$message.error(data.message)
              }
              this.loading = false
            })
      }).catch()
    },
    apiPath() {
      return '/person'
    },
    removePer(id) {
      this.$confirm('此操作将删除选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http.post('/person/delete', {id})
            .then(({data}) => {
              if (data.success) {
                this.$message.success(data.message)
                this.getPerson()
              } else {
                this.$message.error(data.message)
              }
              this.loading = false
            })
      }).catch()
    },
    loadLibRoot() {
      this.loading = true
      this.$http.post('/organise/organiseTree', {all: true, sysId: this.sysId})
          .then(({data}) => {
            if (data.success) {
              this.menuData = data.data ? data.data : []
            } else {
              this.$message.error(data.message)
            }
            this.loading = false
          })
      this.ConfigForm = {}
    },
    $init() {
      this.loadLibRoot();
      this.getUserName();
      this.getPerson();
    },
    click(data) {
      this.ConfigForm = data.data
      this.organiseId = this.ConfigForm.id
      this.orgName = data.data.name
      this.getPerson()
    },
    getPerson() {
      this.$http.post('/person/page', {
        defaultOrganiseId: this.organiseId,
        userName: this.thisForm.userName,
        userCode: this.thisForm.userCode,
        status: this.thisForm.status,
        personType: this.thisForm.personType,
        page: true
      }).then(({data}) => {
        if (data && data.success) {
          this.personData = data.data.data
          this.page.index = data.data.start / data.data.size + 1
          this.page.size = data.data.size
          this.page.total = data.data.total
        } else {
          this.personData = []
        }
      })
    },
    getUserName() {
      this.$http.post('/login/info').then(({data}) => {
        this.username = data.data.userName;
      })
    },
    getMsgFromForm(searchForm) {
      this.thisForm = searchForm;
    },
    async showRole(row) {
      this.roleDialogVisible = true
      const {data} = await this.$post('/sysrole/userRole', {id: row.id})
      if (data.success) {
        this.roles = data.data
      } else {
        this.roles = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.system_person_id {
  display: flex;
  flex: 1;

  .person_main {
    flex: 1;

    .el-row {
      height: 100%;
      flex: 1;

      .el-col {
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .el-card {
        display: flex;
        flex: 1;
        flex-direction: column;

        .el-tree {
          flex: 1;
          height: 90%;
          overflow-y: scroll;
        }

        ::v-deep .el-card__body {
          flex: 1;
          overflow: auto;
          display: flex;

          .table-wrapper {
            flex: 1;
            height: 99%;
          }
        }
      }
    }
  }
}
</style>
