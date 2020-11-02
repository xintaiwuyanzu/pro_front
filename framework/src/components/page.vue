<template>
  <el-pagination
      @current-change="i=>$emit('change',i)"
      :current-page.sync="page.index"
      :page-size="page.size"
      layout="total, prev, pager, next"
      :total="page.total">
  </el-pagination>
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
