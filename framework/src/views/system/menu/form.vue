<template>
  <section>
    <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'菜单'" width="50%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="所属系统：">
          <el-input v-model="form.sysName" disabled/>
        </el-form-item>
        <el-form-item label="名称：" prop="name" required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <icon-select v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="链接：" prop="url" :required="form.leaf" v-show="form.leaf">
          <el-autocomplete v-model="form.url" :disabled="!form.leaf" :fetch-suggestions="selectUrl"
                           style="width: 100%"/>
        </el-form-item>
        <el-form-item label="是否子菜单：" prop="leaf" required>
          <el-select v-model="form.leaf" clearable placeholder="是否子菜单">
            <el-option v-for="item in trueFalseOptions" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用：" prop="status" required>
          <el-select v-model="form.status" clearable placeholder="请选择是否可用">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="order">
          <el-input v-model="form.order"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input type="textarea" v-model="form.description"/>
        </el-form-item>
        <el-form-item label="请求参数：" prop="params">
          <el-input type="textarea" v-model="form.params" :autosize="{ minRows: 3, maxRows: 5}"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveForm" v-loading="loading">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editParent" :title="(form.id?'编辑':'添加')+'菜单'" width="50%">
      <el-form :model="form" ref="editParent" label-width="120px">
        <el-form-item label="所属系统：">
          <el-input v-model="form.sysName" disabled/>
        </el-form-item>
        <el-form-item label="名称：" prop="name" disabled required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <menu-tree v-on:changeParent="changeParent" :resources="resources"></menu-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editParent=false">取 消</el-button>
        <el-button type="primary" @click="saveParentForm" v-loading="loading">保 存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import fromMixin from '@dr/auto/lib/util/formMixin'
import {views} from '@dr/auto'
import menuTree from "./menuTree";

export default {
  mixins: [fromMixin],
  components: {menuTree},
  data() {
    return {
      autoClose: true,
      editParent: false,
      path: '/sysmenu',
      paths: views.map(v => ({value: v.path}))
    }
  },
  props: {
    resources: {type: Array, default: () => []},
  },
  methods: {
    selectUrl(query, cb) {
      if (query) {
        cb(this.paths.filter(p => p.value.indexOf(query) >= 0))
      } else {
        cb(this.paths)
      }
    },
    search() {
      if (this.$parent && this.$parent.loadMenus) {
        this.$parent.loadMenus()
      }
    },
    editParentForm(formData) {
      if (formData) {
        this.editFormData = Object.assign({}, formData)
        this.form = Object.assign({}, formData)
      } else {
        this.editFormData = {}
        this.initForm()
      }
      this.editParent = true
    },
    changeParent(id) {
      this.form.parentId = id
    },
    saveParentForm() {
      let path = this.fixPath(this.apiPath())
      if (this.form.id) {
        path = path + '/update'
      } else {
        path = path + '/insert'
      }
      this.$http.post(path, this.form).then(({data}) => {
        if (data && data.success) {
          this.form = data.data
          this.$message.success('保存成功！')
          this.editParent = false
          this.$parent.loadData()
        } else {
          this.$message.error(data.message)
        }
        this.loading = false
      })

    }
  }
}
</script>