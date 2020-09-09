<script lang="jsx">
export default {
  props: {
    url: {type: String},
    className: {type: String, default: 'index_main'}
  },
  functional: true,
  render(createElement, context) {
    let src;
    if (context.$route && context.$route.query) {
      src = context.$route.query.$url
    }
    if (!src) {
      src = context.props.url
    }
    if (src) {
      return (
          <section>
            <nac-info/>
            <iframe class={context.props.className} frameborder="0" src={src}/>
          </section>
      )
    } else {
      return (
          <section>
            <nac-info/>
            <div class={context.props.className}>未找到页面</div>
          </section>
      )
    }
  }
}
</script>
