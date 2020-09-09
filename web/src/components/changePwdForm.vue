<template>
    <el-dialog :visible.sync="edit" :title="'修改密码'" width="20%" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="旧密码：" prop="oldPwd" required>
                <el-input v-model="form.oldPwd" placeholder="请输入旧密码"  show-password/>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPwd" required>
                <el-input v-model="form.newPwd" placeholder="请输入新密码"  show-password/>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirmPwd" required>
                <el-input v-model="form.confirmPwd" placeholder="请再次输入新密码"  show-password/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="changePwd()" v-loading="loading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  import fromMixin from '@/util/formMixin'
  import {Base64} from 'js-base64';
  export default {
    data () {
      return {
          form:{
              oldPwd: '',
              newPwd:'',
              confirmPwd:'',
          },
      }
    },
    methods: {
        changePwd(){
            if(this.form.newPwd==this.form.confirmPwd) {
                this.$http.post('/sysadmin/changePassword', {
                    adminId: this.form.id,
                    oldPwd: Base64.encode(this.form.oldPwd),
                    newPwd: Base64.encode(this.form.newPwd)
                })
                    .then(({data}) => {
                            this.form = data.data
                            if (data.success) {
                            this.$message.success('修改成功，请重新登录。')
                            this.logout()
                        }else {
                            this.$message.error(data.message)
                        }
                    })
            }else{
                this.$message.error("新密码两次输入不一致！")
            }
        },
        logout(){
            this.$store.commit('logout');
        },
    },
    mixins: [fromMixin]
  }
</script>
