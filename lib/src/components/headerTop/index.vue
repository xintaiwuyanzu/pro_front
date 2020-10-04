<script lang="jsx">

export default {
  name: 'HeaderTop',
  functional: true,
  render(createElement, context) {
    return (
        <section>
          <div style="flex: 1">
            {context.children}
          </div>
        </section>
    )
  }
}
</script>

