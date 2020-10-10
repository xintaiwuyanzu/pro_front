<template>
  <div class="breadcrumb-container">
    <strong class="title">
      {{ title ? title : menu.label }}
    </strong>
    <section class="slot">
      <slot/>
      <el-button type="success" size="mini" @click="$router.back()" v-if="back">返 回</el-button>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    /**
     * 显示名称
     */
    title: {required: false},
    /**
     * 是否显示返回按钮
     */
    back: Boolean
  }
}
</script>

