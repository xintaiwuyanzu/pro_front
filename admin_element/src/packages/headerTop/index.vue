<script lang="jsx">
import logo from '../logo'

export default {
  name: 'HeaderTop',
  functional: true,
  render(createElement, context) {
    return (
        <section>
          <logo style="margin-top: auto;margin-bottom: auto " img="margin-right: 10px"/>
          <div style="flex: 1">
            {context.children}
          </div>
        </section>
    )
  }
}
</script>

