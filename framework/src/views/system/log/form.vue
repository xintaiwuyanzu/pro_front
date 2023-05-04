<template>
  <section>
    <el-form :model="searchForm" ref="searchForm" inline class="searchForm">
      <el-form-item label="操作人：" prop="person">
        <el-input v-model="searchForm.person" placeholder="请输入操作人编码" clearable/>
      </el-form-item>
      <el-form-item label="操作对象：" prop="perated">
        <el-input v-model="searchForm.perated" placeholder="请输入操作对象" clearable/>
      </el-form-item>
      <el-form-item label="操作结果：" prop="logresult">
        <el-input v-model="searchForm.logresult" placeholder="请输入操作结果" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini">搜 索</el-button>
        <el-button @click="$refs.searchForm.resetFields()" size="mini">重 置</el-button>
        <el-button @click="expLog" size="mini" type="primary">导出EXCEL</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import fromMixin from '@dr/auto/lib/util/formMixin'

export default {
  mixins: [fromMixin],
  components: {},
  data() {
    return {
      searchForm: {
        person: '',
        logresult: '',
        perated: ''
      },
    }
  },
  filters: {},
  methods: {
    expLog() {
      let url = "api/gestion/expLog"
      window.open(url)
    }
  }
}
</script>
<style scoped>
.el-form {
    display: flex;
    justify-content: right;
    flex-wrap: wrap;
    margin-bottom: 12px;
}

.el-form-item {
    margin-bottom: 3px;
    margin-right: 0px;
    white-space: nowrap;
}

.el-button {
    padding: 9px 15px;
    margin-left: 8px;
}

/deep/.el-form-item__label {
    padding-left: 10px;
}

.el-input {
    max-width: 200px;
}
</style>