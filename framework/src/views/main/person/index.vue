<template>
  <section>
    <nac-info>
    </nac-info>
    <div class="index_main card">
      <el-row>
        <el-col :span="5">
          <el-card shadow="hover">
            <div slot="header">
              <strong>部门单位</strong>
            </div>
            <div style="min-height:78vh;overflow:auto">
              <el-tree class="sysMenuTree"
                       :data="menuData"
                       default-expand-all
                       @node-click="click"
                       ref="menuTree">
                <div style="flex: 1;margin: 2px; " slot-scope="{ node, data }">
                  <span v-if="organiseId==data.data.id" style=" color: red;font-family: 等线">{{ data.label }}</span>
                  <span v-if="organiseId!=data.data.id" style=" color: #409EFF;font-family: 等线">{{ data.label }}</span>
                </div>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-card shadow="hover" style="min-height:85vh;overflow:auto">
            <div slot="header">
              <strong>人员详情</strong>

            </div>
            <config-form ref="form" v-if="showSearch" @func="getMsgFromForm" :organiseId="organiseId"
                         @getPerson="getPerson"/>
            <div class="table-container" style="height: 65vh">
              <el-table :data="personData" border height="100%">
                <el-table-column label="排序" type="index" fixed align="center"/>
                <el-table-column prop="userName" label="用户姓名" align="center" header-align="center"/>
                <el-table-column prop="userCode" label="用户编号" align="center" header-align="center"/>
                <el-table-column prop="mobile" label="手机号" align="center" header-align="center"
                                 show-overflow-tooltip/>
                <el-table-column prop="email" label="邮箱" align="center" header-align="center"
                                 show-overflow-tooltip/>
                <el-table-column label="性 别" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.sex|dict({0: '女', 1: '男'}) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center"
                                 fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editForm(scope.row)">编 辑</el-button>
                    <el-button type="text" size="small" @click="removePer(scope.row.id)">删 除
                    </el-button>
                    <el-button type="text" size="small" @click="showRoleDialog(scope.row)">角色授权
                    </el-button>
                    <el-button type="text" size="small" @click="resetPws(scope.row)">重置密码
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
                @current-change="index=>getPerson({pageIndex:index-1},true)"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next"
                :total="page.total">
            </el-pagination>
          </el-card>
        </el-col>
        <!--                <per-form ref="perForm"></per-form>-->
      </el-row>
    </div>
    <el-dialog
        :title="rolenametitle"
        :visible.sync="roleDialogVisible">

      <el-row style="min-height: 400px;max-height: 500px;overflow-y: scroll;">
        <el-tree
            style="padding-bottom: 100px;padding-left: 30px;"
            :data="roleTree"
            show-checkbox
            :props="props"
            node-key="id"
            check-strictly
            ref="roletree"
            :default-checked-keys="defaultcheckarray"
            highlight-current="true"
            default-expand-all="true">
        </el-tree>
      </el-row>
      <el-row style="text-align: right">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showquan">确 定</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import ConfigForm from './form'
import indexMixin from '@dr/core/lib/util/indexMixin'
import Base64 from 'base64-js'

export default {
  components: {ConfigForm},
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
      shouquanuserid: ''
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
        this.$http.post('/gestion/resetPassword', {
          personId: row.id,
          newPwd: Base64.encode("123456")
        })
            .then(({data}) => {
              if (data.success) {
                this.$message({
                  message: '重置密码成功！',
                  type: 'success'
                });
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
        this.$http.post('/gestion/deletePerson', {
          personId: id
        })
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
    }
  }
}
</script>
<style lang="scss">
.sysMenuTree {
  height: auto;
  overflow: auto;
  margin-bottom: 10px;
}

.el-tree-node__content {
  height: auto;
}

.buttons {
  float: right;
}

/*.actives{
    background-color: #8cc5ff;
}*/
</style>
