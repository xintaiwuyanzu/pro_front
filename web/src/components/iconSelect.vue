<template>
  <el-tooltip placement="bottom" effect="light">
    <div slot="content">
      <div>
         <span @click="iconSelected(icon)" v-for="icon in icons" :key="icon">
          <icon :icon="icon"/>
        </span>
      </div>
      <div>
        <span @click="iconSelected(icon)" v-for="icon in elicons" :key="icon">
          <icon :icon="icon"/>
        </span>
      </div>
    </div>
    <icon :icon="defaultIcon"></icon>
  </el-tooltip>
</template>
<script>
  import icon from 'vue-icon/lib/feather-icons.esm'

  const elicons = ['el-icon-info', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question', 'el-icon-back', 'el-icon-arrow-left', 'el-icon-arrow-down', 'el-icon-arrow-right', 'el-icon-arrow-up', 'el-icon-caret-left', 'el-icon-caret-bottom', 'el-icon-caret-top', 'el-icon-caret-right', 'el-icon-d-arrow-left', 'el-icon-d-arrow-right', 'el-icon-minus', 'el-icon-plus', 'el-icon-remove', 'el-icon-circle-plus', 'el-icon-remove-outline', 'el-icon-circle-plus-outline', 'el-icon-close', 'el-icon-check', 'el-icon-circle-close', 'el-icon-circle-check', 'el-icon-circle-close-outline', 'el-icon-circle-check-outline', 'el-icon-zoom-out', 'el-icon-zoom-in', 'el-icon-d-caret', 'el-icon-sort', 'el-icon-sort-down', 'el-icon-sort-up', 'el-icon-tickets', 'el-icon-document', 'el-icon-goods', 'el-icon-sold-out', 'el-icon-news', 'el-icon-message', 'el-icon-date', 'el-icon-printer', 'el-icon-time', 'el-icon-bell', 'el-icon-mobile-phone', 'el-icon-service', 'el-icon-view', 'el-icon-menu', 'el-icon-more', 'el-icon-more-outline', 'el-icon-star-on', 'el-icon-star-off', 'el-icon-location', 'el-icon-location-outline', 'el-icon-phone', 'el-icon-phone-outline', 'el-icon-picture', 'el-icon-picture-outline', 'el-icon-delete', 'el-icon-search', 'el-icon-edit', 'el-icon-edit-outline', 'el-icon-rank', 'el-icon-refresh', 'el-icon-share', 'el-icon-setting', 'el-icon-upload', 'el-icon-upload2', 'el-icon-download', 'el-icon-loading']
  export default {
    name: 'iconSelect',
    props: {value: String},
    data () {
      return {
        defaultIcon: 'settings',
        elicons,
        icons: Object.keys(icon)
      }
    },
    methods: {
      iconSelected (v) {
        this.defaultIcon = v
        this.$emit('input', v)
      }
    },
    mounted () {
      if (this.value) {
        this.defaultIcon = this.value
      } else {
        this.$emit('input', this.defaultIcon)
      }
    }
  }
</script>

<style scoped>

</style>