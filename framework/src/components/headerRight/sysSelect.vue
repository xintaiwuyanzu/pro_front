<template>
  <el-dropdown type="primary" @command="changeSys">
    <section class="top_icon">
      <icon icon="chrome"/>
    </section>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="s in sys.subSys" :key="s.id" :command="s.id">
        {{ s.sysName || s.shortName }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>/**
 * 系统切换功能
 */
import {useMenu} from "../../hooks/useMenu";
import {onMounted, reactive} from "vue-demi";
import {http} from "../../plugins/http";

export default {
  name: "sysSelect",
  setup() {
    const {menuData} = useMenu()
    const sys = reactive({subSys: []})
    onMounted(async () => {
      const {data} = await http().post('/subsys/page', {page: false})
      sys.subSys = data.data
    })
    const changeSys = (sysCode) => {
      menuData.sys = sys.subSys.find(s => s.id === sysCode)
    }
    return {
      changeSys,
      sys
    }
  }
}
</script>