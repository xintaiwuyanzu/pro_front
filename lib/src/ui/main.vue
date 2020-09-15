<script lang="jsx">
export default {
  /**
   * 总共分为上左中下四个区域
   *
   *
   */
  props: {
    rootClassName: {type: String, default: 'root'},
    headerClassName: {type: String, default: 'header'},
    mainClassName: {type: String, default: 'main'},
    leftClassName: {type: String, default: 'left'},
    footClassName: {type: String, default: 'foot'}
  },
  functional: true,
  render(createElement, context) {
    return (
        <el-container class={context.props.rootClassName}>
          <el-header class={context.props.headerClassName}>
            <slot name="header">
              <header-top>
                <slot name="headerChild"/>
              </header-top>
            </slot>
          </el-header>
          <el-container style="overflow: auto;">
            <el-aside width="auto" style="padding: 0px" class={context.props.leftClassName}>
              <slot name="left">
                <left-menu/>
              </slot>
            </el-aside>
            <el-main style="padding: 0px;" class={context.props.mainClassName}>
              <transition name="fade-transform" mode="out-in">
              </transition>
            </el-main>
          </el-container>
          <el-footer class={context.props.footClassName}>
            <slot name="footer"/>
          </el-footer>
        </el-container>
    )
  }
}
</script>
