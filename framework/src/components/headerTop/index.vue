<template>
  <section class="header-content">
    <span>{{ headerTitle }}</span>
    <div style="margin-left: auto;display: flex;justify-content: center">
      <!--这里插入自定义组件-->
      <slot/>
      <Logout v-if="logout"/>
    </div>
  </section>
</template>
<script>
import Logout from './logout'

/**
 * TODO  logo等其他参数
 */
export default {
  components: {Logout},
  props: {
    /**
     * 标题
     */
    title: {type: String, required: false},
    /**
     * 是否显示登出按钮
     */
    logout: {default: true}
  },
  computed: {
    headerTitle() {
      if (this.title) {
        return this.title
      }
      return document.title
    }
  }
}
</script>

