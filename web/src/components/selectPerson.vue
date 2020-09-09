<template>
    <el-select :value="id" style="width: 100%" :placeholder="placeholder" @change="change" clearable filterable>
        <el-option
                v-for="item in persons"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
  export default {
    props: {
      id: {type: String},
      placeholder: {type: String}
    },
    model: {event: 'selected', prop: 'id'},
    data () {
      return {
        persons: [],
        label: ''
      }
    },
    methods: {
      change (v) {
        if (v) {
          this.label = this.persons.find(d => d.id === v).userName
        } else {
          this.label = ''
        }
        this.$emit('selected', v)
      }
    },
    mounted () {
      this.$http.post('/person/page?page=false')
        .then(({data}) => {
          if (data.success) {
            this.persons = data.data
          }
        })
    }
  }
</script>
