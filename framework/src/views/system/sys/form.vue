<template>
  <section>
    <el-form :model="searchForm" ref="searchForm" inline class="searchForm">
      <el-form-item label="名称：" prop="key">
        <el-input v-model="searchForm.sysName" placeholder="请输入系统名称" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini">搜 索</el-button>
        <el-button @click="$refs.searchForm.resetFields()">重 置</el-button>
        <el-button type="primary" @click="editForm()" size="mini">添加</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'子系统'" width="80%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="系统名称：" prop="sysName" required>
          <el-input v-model="form.sysName" placeholder="请输入系统名称" clearable/>
        </el-form-item>
        <el-form-item label="系统描述：" prop="sysDescription">
          <el-input type="textarea" v-model="form.sysDescription" :autosize="{ minRows: 3, maxRows: 6 }"
                    placeholder="请输入系统描述" clearable/>
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
      path: '/subsys/',
      searchForm: {sysName: ''},
      autoClose: true,
      defaultForm: {
        sysName: '',
        sysDescription: ''
      }
    }
  },
  mixins: [fromMixin]
}
</script>
