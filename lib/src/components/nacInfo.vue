<template>
  <div class="breadcrumb-container">
    <strong class="title">{{ label }} </strong>
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
    title: {required: false, type: String},
    /**
     * 是否显示返回按钮
     */
    back: Boolean
  },
  computed: {
    /**
     * 计算显示类型
     * @returns {String|*|string}
     */
    label() {
      if (this.title) {
        return this.title
      }
      if (this.$store.state.menu) {
        const {menu} = this.$store.state
        return menu.currentMenu ? menu.currentMenu.label : ''
      }
      return ''
    }
  }
}
</script>

