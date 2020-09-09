<template>
  <div class="breadcrumb-container">
    <strong class="title">
      <el-button type="primary"
                 v-if="back"
                 icon="el-icon-arrow-left"
                 size="mini"
                 @click="backClk">返回
      </el-button>
      {{ showLabel }}
    </strong>
    <section class="slot">
      <slot></slot>
    </section>
  </div>
</template>
<script lang="jsx">
import {Button} from "element-ui";

export default {
  name: "NavInfo",
  components: {ElButton: Button},
  props: {
    title: {required: false},
    back: {required: false, default: false}
  },
  computed: {
    /**
     *显示的标签
     */
    showLabel() {
      return this.title || (this.menu ? this.menu.label : '')
    }
  },
  methods: {
    /**
     * 返回按钮点击事件
     */
    backClk() {
      if (this.$router) {
        this.$router.back()
      }
    }
  }
}
</script>
