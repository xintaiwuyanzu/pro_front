<template>
  <el-tooltip content="全屏" placement="bottom">
    <section class="top_icon" @click="toggleFull">
      <icon :icon="fullscreen?'minimize-2':'maximize-2'"/>
    </section>
  </el-tooltip>
</template>
<script>
export default {
  name: "fullScreen",
  data() {
    return {
      fullscreen: document.fullscreen
    }
  },
  methods: {
    toggleFull() {
      if (this.fullscreen) {
        document.exitFullscreen()
      } else {
        document.body.requestFullscreen()
      }
    },
    listenFullscreen() {
      this.fullscreen = document.fullscreen
    }
  },
  created() {
    window.addEventListener('fullscreenchange', this.listenFullscreen)
  },
  beforeDestroy() {
    window.removeEventListener('fullscreenchange', this.listenFullscreen)
  }
}
</script>