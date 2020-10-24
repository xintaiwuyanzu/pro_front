<script lang="jsx">
import vueIcon from 'vue-icon/lib/vue-feather.esm'

export default {
  name: 'icon',
  components: {vueIcon},
  props: {icon: String, default: {type: String, default: 'setting'}},
  render() {
    let icon = this.icon
    if (!icon) {
      icon = 'setting'
    }
    if (icon.startsWith('el-icon')) {
      return <i class={icon}/>
    } else {
      return <vue-icon name={icon} class={'svg-icon-' + icon}/>
    }
  }
}
</script>
<style>
[class*="svg-icon-"], [class^=svg-icon-] {
  width: 20px;
  height: 20px;
}
</style>
