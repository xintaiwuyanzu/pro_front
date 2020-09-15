<script lang="jsx">
import {MenuItem, Submenu} from 'element-ui'
import icon from './icon'

export default {
  name: 'TreeMenu',
  props: {
    menuData: {type: Array, default: () => []}
  },
  render() {
    return (
        <section>
          {this.menuData.map(m => {
            if (m.children) {
              return (
                  <Submenu index={m.id}>
                    <template slot="title">
                      <icon icon={m.data.icon} style="color: white"/>
                      <span slot="title" class="stitle">{m.label}</span>
                    </template>
                    <tree-menu menuData={m.children}/>
                  </Submenu>
              )
            } else {
              return (
                  <MenuItem index={m.id} onClick={() => this.$store.commit('menuChange', m)}>
                    <icon icon={m.data.icon} style="color: white"/>
                    <span slot="title" className="stitle">{m.label}</span>
                  </MenuItem>
              )
            }
          })
          }
        </section>
    )
  }
}
</script>
