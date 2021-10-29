<template>
  <section>
    <el-table :data="resources" row-key="id" highlight-current-row width="300px" @current-change="handleCurrentChange"
              border default-expand-all height="100%" class="resourceSelect">
      <el-table-column prop="label" label="资源名称" header-align="center" show-overflow-tooltip min-width="100px"/>
    </el-table>
  </section>
</template>
<script>

/**
 * 权限编辑组件
 */
export default {
  props: {
    resources: {type: Array, default: () => []},
    //parts: {type: Array, default: () => []},
    code: {type: String, default: ''}
  },
  data() {
    return {
      parts: [{code: 'test', label: '测试'}],
      matcher: {}
    }
  },
  methods: {
    $init() {
      this.matcher = {}
      if (this.code) {
        this.code.trim().split(";")
            .forEach(c => {
              if (c) {
                const arr = c.trim().split(':')
                this.matcher[arr[0].trim()] = arr.length > 1 ? arr[1].split(',').map(v => v.trim()) : []
              }
            })
      }
    },
    changAll(id, t) {
      if (t) {
        this.$set(this.matcher, id, this.parts.map(p => p.code))
      } else {
        this.$delete(this.matcher, id)
      }
    },
    change(id, t, p) {
      const arr = this.matcher[id]
      if (t) {
        if (arr) {
          if (arr.indexOf(p) < 0) {
            this.$set(arr, arr.length, p)
          }
        } else {
          this.$set(this.matcher, id, [p])
        }
      } else {
        if (arr) {
          const index = arr.indexOf(p);
          if (index >= 0) {
            this.$delete(arr, index)
          }
          if (arr.length === 0) {
            this.$delete(this.matcher, id)
          }
        }
      }
    },
    handleCurrentChange(val) {
      this.$emit("changeParent", val.id)
    }
  }
}
</script>
<style lang="scss">
.resourceSelect {
  line-height: normal;

  th {
    padding: 0px;
  }
}
</style>
