<script lang="jsx">
export default {
  props: {
    /**
     * 切换动画
     */
    transition: {type: String, default: 'el-zoom-in-top'},
    /**
     *根class名称
     */
    rootClass: {type: String, default: 'container'}
  },
  functional: true,
  render(createElement, context) {
    return (
        <transition name={context.props.transition}>
          <router-view className={context.props.rootClass}/>
        </transition>
    )
  }
}
</script>

