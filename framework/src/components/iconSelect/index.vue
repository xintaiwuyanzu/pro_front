<template>
  <el-tooltip placement="bottom" effect="light">
    <div slot="content">
      <div>
         <span @click="iconSelected(icon)" v-for="icon in icons" :key="icon">
          <icon :icon="icon"/>
        </span>
      </div>
      <div>
        <span @click="iconSelected('el-icon-'+icon)" v-for="icon in elIcons" :key="icon">
          <icon :icon="'el-icon-'+icon" style="width: 20px;font-size: 20px;"/>
        </span>
      </div>
    </div>
    <icon :icon="defaultIcon" style="width: 20px;font-size: 20px;"/>
  </el-tooltip>
</template>
<script>
import icons from 'vue-icon/lib/feather-icons.esm'
import elIcons from './icon.json'
import icon from '../icon'

export default {
  name: 'iconSelect',
  components: {icon},
  props: {value: String},
  data() {
    return {
      defaultIcon: 'settings',
      elIcons,
      icons: Object.keys(icons)
    }
  },
  methods: {
    iconSelected(v) {
      this.defaultIcon = v
      this.$emit('input', v)
    }
  },
  mounted() {
    if (this.value) {
      this.defaultIcon = this.value
    } else {
      this.$emit('input', this.defaultIcon)
    }
  }
}
</script>
