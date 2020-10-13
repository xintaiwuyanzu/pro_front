<template>
  <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'菜单'" width="450px">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
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
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveForm" v-loading="loading">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import fromMixin from '@dr/core/lib/util/formMixin'

export default {
  mixins: [fromMixin],
  data() {
    return {
      autoClose: true,
      path: '/sysmenu'
    }
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
    }
  }
}
</script>
