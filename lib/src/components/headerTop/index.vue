<template>
  <section class="header-content">
    <span>{{ title }}</span>
    <div style="flex: 1">
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    title() {
      return document.title
    }
  }
}
</script>

