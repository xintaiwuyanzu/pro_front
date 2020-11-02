<template>
  <el-table-column label="序号" align="center" width="50">
    <template slot-scope="scope">
      {{ (page.index - 1) * page.size + scope.$index + 1 }}
    </template>
  </el-table-column>
</template>
<script>
/**
 * 一个省事的组件，用来标引table的索引
 */
export default {
  props: {
    /**
     * 分页属性
     */
    page: {type: Object}
  }
}
</script>
