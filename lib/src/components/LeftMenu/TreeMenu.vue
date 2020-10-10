<script lang="jsx">
import icon from '../icon'

export default {
  name: 'TreeMenu',
  props: {
    menuData: {type: Array, default: () => []}
  },
  methods: {
    menuClick(menu) {
      let url = menu.data.url
      if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
        this.$router.push({name: 'frame', params: {$url: url}, query: {$url: url}})
      } else {
        this.$router.push(menu.data.url)
      }
    }
  },
  render() {
    return (
        <section>
          {this.menuData.map(m => {
            if (m.children) {
              return (
                  <el-submenu index={m.id}>
                    <template slot="title">
                      <icon icon={m.data.icon}/>
                      <span slot="title" class="stitle">{m.label}</span>
                    </template>
                    <TreeMenu menuData={m.children}/>
                  </el-submenu>
              )
            } else {
              return (
                  <el-menu-item index={m.id} onClick={() => this.menuClick(m)}>
                    <icon icon={m.data.icon}/>
                    <span slot="title" class="stitle">{m.label}</span>
                  </el-menu-item>
              )
            }
          })
          }
        </section>
    )
  }
}
</script>
