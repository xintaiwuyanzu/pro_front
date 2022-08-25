<template>
  <el-dropdown type="primary" @command="changeSys" v-show="hasRole('admin')&&sys.subSys.length>0">
    <section class="top_icon">
      <icon icon="chrome"/>
    </section>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="s in sys.subSys" :key="s.id" :command="s.id">
        {{ s.label || s.data.shortName }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>/**
 * 系统切换功能
 */
import {useMenu} from "../../hooks/useMenu";
import {onMounted, reactive} from "vue";
import {http} from "../../plugins/http";

export default {
  name: "sysSelect",
  setup() {
    const {menuData} = useMenu()
    const sys = reactive({subSys: []})
    onMounted(async () => {
      const {data} = await http().post('/sysResource/personResource', {type: 'subsys'})
      if (data.success) {
        sys.subSys = data.data
      } else {
        sys.subSys = []
      }
    })
    const changeSys = (sysCode) => {
      menuData.sys = sys.subSys.find(s => s.id === sysCode).data
    }
    return {
      changeSys,
      sys
    }
  }
}
</script>