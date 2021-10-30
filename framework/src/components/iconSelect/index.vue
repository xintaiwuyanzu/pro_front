<template>
  <section>
    <el-input :value="value" placeholder="请点击左侧图标选择" disabled>
      <el-tooltip placement="bottom" effect="light" slot="prepend">
        <div slot="content">
          <div>
            <span @click="iconSelected('el-icon-'+icon)" v-for="icon in elIcons" :key="icon">
              <icon :icon="'el-icon-'+icon" style="width: 20px;font-size: 20px;"/>
            </span>
          </div>
          <div>
           <span @click="iconSelected(icon)" v-for="icon in icons" :key="icon">
            <icon :icon="icon"/>
          </span>
          </div>
        </div>
        <el-button type="primary">
          <icon :icon="value?value:'el-icon-search'" style="width: 16px;font-size: 16px;"/>
        </el-button>
      </el-tooltip>
      <el-button slot="suffix" type="text" @click="$emit('input','')" title="清除">
        <icon icon="x-circle" style="width: 16px;font-size: 16px;"/>
      </el-button>
    </el-input>
  </section>
</template>
<script>
import icons from 'vue-icon/lib/feather-icons.esm'
import elIcons from './icon.json'
import icon from '../icon'

/**
 * TODO
 */
export default {
  name: 'iconSelect',
  components: {icon},
  props: {value: String},
  data() {
    return {
      elIcons,
      icons: Object.keys(icons)
    }
  },
  methods: {
    iconSelected(v) {
      this.$emit('input', v)
    }
  }
}
</script>
