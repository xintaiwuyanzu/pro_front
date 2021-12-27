<script lang="jsx">
export default {
  props: {
    url: {type: String},
    className: {type: String, default: 'index_main'}
  },
  functional: true,
  render(createElement, context) {
    const parent = context.parent
    let src;
    if (parent) {
      if (parent.$route && parent.$route.query) {
        src = parent.$route.query.$url
      }
      if (!src) {
        src = parent.props.url
      }
    }
    if (src) {
      return (
          <section class="main-container">
            <nac-info/>
            <iframe class={context.props.className} frameborder="0" src={src}/>
          </section>
      )
    } else {
      return (
          <section class="main-container">
            <nac-info/>
            <div class={context.props.className}>未找到页面</div>
          </section>
      )
    }
  }
}
</script>
