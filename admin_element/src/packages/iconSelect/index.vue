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
    <icon :icon="defaultIcon"/>
  </el-tooltip>
</template>
<script>
import elicons from './elIcons.json'
import icon from '../icon/'
import {Tooltip} from 'element-ui'

export default {
  name: 'iconSelect',
  components: {
    elTooltip: Tooltip,
    icon
  },
  props: {value: String},
  data() {
    return {
      defaultIcon: 'settings',
      elicons,
      icons: Object.keys(icon)
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
