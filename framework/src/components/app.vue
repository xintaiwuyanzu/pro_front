<script lang="jsx">
import '../styles/normal.css'

export default {
  render() {
    return (
        <transition name="el-zoom-in-top">
          <router-view class="container"/>
        </transition>
    )
  }
}
</script>
