<script lang="jsx">
import '../styles/main.scss'

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
    leftClassName: {type: String, default: 'left'}
  },
  render() {
    const {rootClassName, headerClassName, leftClassName, mainClassName} = this
    return (
        <el-container class={rootClassName} direction='vertical'>
          <el-header class={headerClassName}>
            <header-top/>
          </el-header>
          <el-container style="overflow: auto;">
            <el-aside width="auto" style="padding: 0px" class={leftClassName}>
              <left-menu/>
            </el-aside>
            <el-main style="padding: 0px;" class={mainClassName}>
              <transition name="fade-transform" mode="out-in">
                <router-view class="main-container"/>
              </transition>
            </el-main>
          </el-container>
        </el-container>
    )
  }
}
</script>
