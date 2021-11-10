<template>
  <section>
    <el-form :model="searchForm" ref="searchForm" inline class="searchForm">
      <el-form-item label="编码：" prop="key" style="padding-right: 5px">
        <el-input v-model="searchForm.key" placeholder="请输入字典编码" clearable/>
      </el-form-item>
      <el-form-item label="描述：" prop="description" style="padding-right: 5px">
        <el-input v-model="searchForm.description" placeholder="请输入字典描述" clearable/>
      </el-form-item>
      <el-form-item label="是否可用：" prop="status" style="padding-right: 5px">
        <select-async :data="statusOptions" valueKey="value"
                      v-model="searchForm.status"
                      clearable
                      placeholder=""
                      style="width: 60px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini">搜 索</el-button>
        <el-button @click="$refs.searchForm.resetFields()">重 置</el-button>
        <el-button type="primary" @click="editForm()" size="mini">添加</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'字典'" width="40%">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="字典编码：" prop="key" required>
          <el-input v-model="form.key" placeholder="请输入字典编码" clearable/>
        </el-form-item>
        <el-form-item label="字典值：" prop="value" required>
          <el-input v-model="form.value" placeholder="请输入字典值" clearable/>
        </el-form-item>
        <el-form-item label="显示类型：" prop="showType">
          <el-select v-model="form.showType" placeholder="请选择字典标签显示类型">
            <el-option v-for="show in showType" :key="show.id" :value="show.id" :label="show.label">
              <el-tag :type="show.id">{{ show.label }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="order">
          <el-input v-model="form.order" placeholder="请输入字典排序" clearable/>
        </el-form-item>
        <el-form-item label="是否可用：" prop="status">
          <el-switch v-model="form.status" active-text="是" inactive-text="否" :active-value="1"
                     :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
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

export default {
  data() {
    return {
      searchForm: {},
      path: 'sysDict',
      autoClose: true,
      showType: [
        {id: 'primary', label: '主要'},
        {id: 'success', label: '成功'},
        {id: 'warning', label: '警告'},
        {id: 'danger', label: '危险'},
        {id: 'info', label: '提示'}
      ],
      defaultForm: {
        key: '',
        value: '',
        showType: '',
        order: '',
        status: 1,
        description: ''
      }
    }
  },
  methods: {
    validateKey(rule, key, cb) {
      if (key) {
        if (this.editFormData.id && this.editFormData.key === key) {
          cb()
        } else {
          this.$post('/sysDict/validate', {key})
              .then(({data}) => {
                if (data.success) {
                  cb()
                } else {
                  cb(new Error(data.message))
                }
              })
              .catch(e => cb(new Error(`校验失败，请稍后重试！\n${e}`)))
        }
      } else {
        cb(new Error('编码不能为空！'))
      }
    }
  },
  mixins: [fromMixin]
}
</script>
