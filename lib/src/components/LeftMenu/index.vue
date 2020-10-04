<script lang="jsx">
import TreeMenu from "./TreeMenu";
import {Menu} from 'element-ui'

export default {
  components: {TreeMenu, ElMenu: Menu},
  render() {
    return <section className="leftMenu">
      <el-menu className="menu"
               unique-opened
               text-color="#000000"
               active-text-color="#e0efff"
               background-color="#FFFFFF">
        <tree-menu/>
      </el-menu>
    </section>
  }
}
</script>
