<template>
  <section>
    <nac-info :title="(id?'编辑':'添加')+'角色'" back>
      <el-button type="primary" @click="save">保存</el-button>
    </nac-info>
    <div class="index_main">
      <el-form :model="form" label-width="120px" ref="form">
        <el-form-item label="角色名称" prop="name" required>
          <el-input v-model="form.name" clearable/>
        </el-form-item>
        <el-form-item label="角色编码" prop="code" required>
          <el-input v-model="form.code" clearable/>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" clearable/>
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input v-model="form.order" type="number" clearable/>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-transfer filterable :filter-method="filterMethod"
                       :titles="['所有权限','选中权限']" filter-placeholder="请输入权限名称搜索"
                       v-model="rolePermissions" :data="permissions">
          </el-transfer>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      id: this.$route.query.id,
      form: {
        name: '',
        description: '',
        code: '',
        order: 0
      },
      rolePermissions: [],
      permissions: [],
    }
  },
  methods: {
    save() {
      this.$refs.form.validate((success) => {
        if (success) {
          const params = Object.assign({permissions: this.rolePermissions.join(',')}, this.form)
          this.$post(`/sysrole/${this.id ? 'update' : 'insert'}`, params)
              .then(() => {
                this.$message.success('保存成功')
                this.$router.back()
              })
        } else {
          this.$message.warning('请填写完整表单')
        }
      })
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
    },
    async $init() {
      if (this.id) {
        //查询角色基本信息
        const {data} = await this.$post('/sysrole/detail', {id: this.id})
        this.form = data.data
        //查询角色的所有权限
        const rp = await this.$post('/sysrole/rolePermission', {id: this.id})
        this.rolePermissions = rp.data.data
      }
      //查询所有的权限
      const rs = await this.$post('/sysPermission/page', {page: false})
      this.permissions = rs.data.data.map(p => ({key: p.id, label: p.name}))
    }
  }
}
</script>
