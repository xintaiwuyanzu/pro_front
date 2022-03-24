<template>
  <table-index path="subsys" :fields="columns" v-if="hasRole('admin')"/>
</template>
<script>
/**
 * 子系统管理
 */
export default {
  name: 'sys',
  role: ['admin'],
  data() {
    return {
      columns: {
        id: {label: '系统编码', required: true},
        sysName: {label: '系统名称', search: true, required: true},
        sysDescription: {label: '系统描述'}
      }
    }
  }
}
</script>
