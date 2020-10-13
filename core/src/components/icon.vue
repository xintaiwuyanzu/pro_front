<script lang="jsx">
import vueIcon from 'vue-icon/lib/vue-feather.esm'

export default {
  name: 'icon',
  components: {vueIcon},
  props: {icon: String, default: {type: String, default: 'setting'}},
  render() {
    if (this.icon.startsWith('el-icon')) {
      return <i class={this.icon}/>
    } else {
      return <vue-icon name={this.icon} class={'svg-icon-' + this.icon}/>
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
