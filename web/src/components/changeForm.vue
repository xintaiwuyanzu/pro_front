<template>
    <el-dialog :visible.sync="edit" :title="'个人信息'" width="320px" :close-on-click-modal="false">
        <el-form :model="personForm" :rules="rules" ref="form" label-width="120px">
            <el-row style="max-width: content-box">
                <el-form-item label="用户姓名：">
                    <span>{{ user.userName}}</span>
                    <!--<el-button style="border: none">→去修改</el-button>-->
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="用户编号：">
                    <span>{{ user.userCode}}</span>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="手机号：">
                    <span>{{ user.mobile}}</span>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="身份证号：">
                    <span>{{ user.idNo}}</span>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="邮   箱：">
                    <span>{{ user.email}}</span>
                </el-form-item>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="changePwd()" v-loading="loading">修改密码</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import indexMixin from '@/util/indexMixin'
    import fromMixin from '@/util/formMixin'

    export default {
        mixins: [indexMixin, fromMixin],
        data() {
            return {
                libIds: [],
                personForm: {},
                dict: ['loc.type'],
                user: {}
            }
        },
        methods: {
            $init() {
                this.$http.post('/login/info', )
                    .then(({data}) => {
                        if (data.success) {
                            this.user = data.data
                        }
                    })
            },
            changePwd() {
                this.edit = false
                this.$parent.changePwds()
            },
            saveForm() {
                if (this.$refs.form) {
                    this.loading = true
                    this.$refs.form.validate(valid => {
                        if (valid) {
                            let path = '/gestion/update'
                            this.$http.post(path, this.form).then(({data}) => {
                                if (data && data.success) {
                                    this.form = data.data
                                    this.$message.success('保存成功！')
                                    this.logout()
                                } else {
                                    this.$message.error(data.message)
                                }
                                this.loading = false
                            })
                        } else {
                            this.loading = false
                        }
                    })
                }
            },
            logout() {
                this.$store.commit('logout');
            },
        },
    }
</script>
