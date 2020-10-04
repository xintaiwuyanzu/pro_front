<script lang="jsx">
export default {
  render() {
    return (
        <transition name="el-zoom-in-top">
          <router-view className="container"/>
        </transition>
    )
  }
}
</script>
