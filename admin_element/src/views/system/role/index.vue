<template>
    <section>
        <nac-info title="角色管理">
            <el-button type="primary" @click="showadddialog">添加角色
            </el-button>
        </nac-info>
        <div class="index_main" v-loading="loading">
            <div class="table-container">
                <el-table :data="tableData" height="100%" :border="true">
                    <el-table-column label="序号" fixed align="center" width="60">
                        <template slot-scope="scope">
                            {{(page.index-1)*page.size+scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="角色名"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="edit(scope.row)">编 辑</el-button>
                            <el-button type="primary" size="mini" @click="getPermision(scope.row)">查看权限</el-button>
                            <el-button type="danger" size="mini" @click="remove(scope.row)">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    @current-change="index=>init({pageIndex:index-1})"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    layout="total, prev, pager, next"
                    :total="page.total">
            </el-pagination>
        </div>
        <el-dialog
                :title="rolenametitle"
                :visible.sync="addDialogVisible">
            <el-row>
                <el-input v-model="addrolebianma" :disabled="disabled" placeholder="请输入角色编码"></el-input>
                <el-input v-model="addrolename" placeholder="请输入角色名" style="padding-top: 20px;"></el-input>
                <el-input v-model="addroleshunxu" placeholder="请输入顺序号" style="padding-top: 20px;"></el-input>
            </el-row>
            <el-row style="padding-top: 20px;text-align: center">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" v-show="showadd" @click="add">确 定</el-button>
                <el-button type="primary" v-show="!showadd" @click="updateRole">确 定</el-button>
            </el-row>
        </el-dialog>
        <el-dialog :title="rolenametitle" :visible.sync="pisDialogVisible">
            <el-row style="min-height: 400px;max-height: 500px;overflow-y: scroll;">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="菜单权限" name="menu">
                        <el-tree :data="menuPermissionTree"
                                 show-checkbox
                                 :props="props"
                                 node-key="id"
                                 ref="menutree"
                                 :default-checked-keys="defaultcheckarray">
                        </el-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <el-row style="text-align: right">
                <el-button @click="pisDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="showquan">确 定</el-button>
            </el-row>
        </el-dialog>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                loading: false,
                searchForm: {
                    roleName: ''
                },
                props: {
                    id: 'id',
                    label: 'label'
                },
                page: {
                    size: 0,
                    total: 0,
                    index: 0
                },
                tableData: [],
                addDialogVisible: false,
                addrolename: '',
                addroleshunxu: '',
                addrolebianma: '',
                role: '',
                rolenametitle: '权限',
                disabled: false,
                showadd: true,
                pisDialogVisible: false,
                activeName: 'menu',
                menuPermissionTree: [],
                roleid: '',
                baseMenuIds: [],
                defaultcheckarray: [],
            }
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },
            //数组比较
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
                let array = this.$refs.menutree.getCheckedNodes()
                if (array.length === 0) {
                    this.$message.error('请至少选择一个权限！')
                    return
                }
                let array2 = []
                for (let i = 0; i < array.length; i++) {
                    if (array[i].children == null) {
                        array2.push(array[i].id)
                    }
                }
                let addMenus = this.compare(this.baseMenuIds, array2)
                let deleteMenus = this.compare(array2, this.baseMenuIds)
                let addids = ''
                let deleteids = ''
                for (let i = 0; i < addMenus.length; i++) {
                    addids = addids + addMenus[i] + ','
                }
                for (let i2 = 0; i2 < deleteMenus.length; i2++) {
                    deleteids = deleteids + deleteMenus[i2] + ','
                }
                this.$http.post(`/sysrole/addPermissionToRole`, {
                    roleId: this.roleid,
                    addMenuIds: addids,
                    delMenuIds: deleteids
                }).then(({data}) => {
                    if (data.success) {
                        this.$message({
                            message: '操作成功！',
                            type: 'success'
                        });
                        this.pisDialogVisible = false
                    } else {
                        this.$message.error(data.message)
                    }
                }).catch(function () {
                    this.$message.error('给角色授权时出了点问题...')
                })
            },
            handleClick(tab) {
                this.activeName = tab.name
            },
            showadddialog() {
                this.disabled = false
                this.rolenametitle = '新增角色'
                this.showadd = true
                this.addDialogVisible = true
                this.addrolename = ''
                this.addrolebianma = ''
                this.addroleshunxu = ''
            },
            getPermision(role2) {
                this.rolenametitle = role2.name + '权限'
                this.pisDialogVisible = true
                //请求后台，获取菜单权限树
                this.roleid = role2.id
                this.menuPermissionTree = []
                this.$http.post(`/sysrole/getPermissionMenuList`, {id: this.roleid, name: 'menu'}).then(({data}) => {
                    if (data.success) {
                        this.menuPermissionTree = data.data
                    } else {
                        this.$message.error(data.message)
                    }
                }).catch(function () {
                    this.$message.error('获取权限树时出了点问题...')
                })
                this.$http.post(`/sysmenu/page`, {
                    id: this.roleid,
                    name: 'menu', page: false
                }).then(({data}) => {
                    if (data.success) {
                        var mycars = new Array()
                        for (let i = 0; i < data.data.length; i++) {
                            mycars[i] = data.data[i].id;
                        }
                        this.defaultcheckarray = mycars;
                        this.baseMenuIds = mycars
                    } else {
                        this.$message.error(data.message)
                    }
                }).catch(function () {
                    this.$message.error('获取权限树时出了点问题...')
                })
            },
            edit(row) {
                this.rolenametitle = '修改角色'
                this.showadd = false
                this.disabled = true
                this.addDialogVisible = true
                this.addrolename = row.name
                this.addrolebianma = row.code
                this.addroleshunxu = row.order
                this.role = row
            },
            updateRole() {
                this.role.name = this.addrolename
                this.role.order = this.addroleshunxu
                this.role.code = this.addrolebianma

                this.$http.post(`/sysrole/updateRole`, this.role
                ).then(({data}) => {
                    if (data.success) {
                        this.$message({
                            message: '操作成功！',
                            type: 'success'
                        });
                        this.init(1)
                    } else {
                        this.$message.error(data.message)
                    }
                }).catch(function () {
                    this.$message.error('更新角色时出了点问题...')
                })
            },
            add() {
                if (this.addrolename === '' || this.addrolename === null || this.addrolename === undefined) {
                    this.$message.error('角色名不能为空！')
                    return
                }
                if (this.addrolebianma === '' || this.addrolebianma === null || this.addrolebianma === undefined) {
                    this.$message.error('角色编码不能为空！')
                    return
                }
                if (this.addroleshunxu === '' || this.addroleshunxu === null || this.addroleshunxu === undefined) {
                    this.$message.error('顺序号不能为空！')
                    return
                }
                this.$http.post(`/sysrole/addRole`, {
                    roleName: this.addrolename,
                    roleCode: this.addrolebianma,
                    order: this.addroleshunxu
                }).then(({data}) => {
                    if (data.success) {
                        this.$message({
                            message: '操作成功！',
                            type: 'success'
                        });
                        this.init(1)
                    } else {
                        this.$message.error(data.message)
                    }
                    this.addDialogVisible = false
                }).catch(function () {
                    this.$message.error('添加角色时出了点问题...');
                    this.addDialogVisible = false
                })
            },
            init(index) {
                this.$http.post(`/sysrole/page`, {
                    page: index
                }).then(({data}) => {
                    if (data.success) {
                        this.tableData = data.data.data
                        this.page.index = data.data.start / data.data.size + 1
                        this.page.size = data.data.size
                        this.page.total = data.data.total
                    } else {
                        this.$message.error(data.message)
                    }
                }).catch(function () {
                    this.$message.error('获取数据时出了点问题...');
                })
            },
            search() {
                this.$http.post(`/sysrole/page`, {
                    page: 1,
                    roleName: this.searchForm.roleName
                }).then(({data}) => {
                    if (data.success) {
                        this.tableData = data.data.data
                        this.page.index = data.data.start / data.data.size + 1
                        this.page.size = data.data.size
                        this.page.total = data.data.total
                    } else {
                        this.$message.error(data.message)
                    }
                }).catch(function () {
                    this.$message.error('获取数据时出了点问题...');
                })
            },
            remove(row) {
                this.$confirm('确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(`/sysrole/deleteRole`, {
                        roleCode: row.code
                    }).then(({data}) => {
                        if (data.success) {
                            this.$message({
                                message: '操作成功！',
                                type: 'success'
                            });
                            this.init(1)
                        } else {
                            this.$message.error(data.message)
                        }
                    }).catch(function () {
                        this.$message.error('删除角色时出了点问题...');
                    })
                }).catch(() => {
                });
            }
        },
        mounted() {
            this.init(1)
        }
    }
</script>

<style scoped>

</style>
