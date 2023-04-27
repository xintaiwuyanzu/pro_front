<template>
  <section>
    <el-form :model="searchForm" ref="searchForm" inline class="searchForm">
      <el-form-item label="用户姓名" prop="userName">
        <el-input v-model="searchForm.userName" placeholder="请输入用户姓名" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchF()" size="mini">搜 索</el-button>
        <el-button type="primary" @click="editForm()" size="mini">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'人员'+(form.id?'':'(默认密码123456)')" width="60%"
               :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户姓名" prop="userName" required>
          <el-input v-model="form.userName" placeholder="请输入用户姓名" clearable/>
        </el-form-item>
        <el-form-item label="用户编号" prop="userCode" required>
          <el-input v-model="form.userCode" placeholder="请输入用户编号" clearable/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option v-for="item in optionSex" :label="item.label" :key="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="duty">
          <select-dict type="org.type" v-model="form.duty" placeholder="请选择职务" style="width: 190px"/>
        </el-form-item>
        <el-form-item label="用户类型" prop="userCode">
          <el-input v-model="form.personType" placeholder="请输入用户类型" clearable/>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入联系电话" clearable/>
        </el-form-item>
        <el-form-item label="邮 箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable/>
        </el-form-item>
        <el-form-item label="是否可用" prop="status">
          <select-async v-model="form.status"
                        clearable
                        placeholder="请选择是否可用"
                        style="width: 120px"
                        valueKey="value"
                        :mapper="statusRole"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 3, maxRows: 6 }"
                    placeholder="请输入字典描述" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveForm" v-loading="loading">保 存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import fromMixin from '@dr/auto/lib/util/formMixin'
import {Base64} from 'js-base64';

export default {
  mixins: [fromMixin],
  data() {
    return {
      form: {
        id: '',
        status: '1'
      },
      autoClose: true,
      searchForm: {
        userName: "",
        userCode: "",
        personType: "",
      },
      defaultForm: {
        key: '',
        value: '',
        order: 0,
        description: '',
      },
      optionSex: [
        {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }
      ],
      statusRole: [
        {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }
      ],
    }
  },
  props: {
    organiseId: String
  },
  methods: {
    searchF() {
      this.$emit('func', this.searchForm)
      this.$emit("getPerson");
    },
    saveForm() {
      let path = '/person'
      if (this.form.id) {
        path = path + '/update'
      } else {
        path = path + '/insert'
      }
      this.form.organiseId = this.organiseId;
      //TODO 这里密码可以后台内置
      this.form.password = Base64.encode('123456');
      this.form.registerLogin = true
      this.$refs.form.validate(v => {
        if (v) {
          this.$http.post(path, this.form)
              .then(({data}) => {
                if (data && data.success) {
                  this.$message.success('保存成功！')
                  this.edit = false;
                  this.searchF()
                } else {
                  this.$message.error(data.message)
                }
                this.loading = false
              })
        }
      })
    },
  }
}
</script>
