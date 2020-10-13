<template>
  <section class="leftMenu">
    <el-menu class="menu"
             :loading="dataLoading"
             unique-opened
             :text-color="textColor"
             :active-text-color="activeTextColor"
             :background-color="backgroundColor">
      <tree-menu :menu-data="menus"/>
    </el-menu>
  </section>
</template>
<script>
import AbstractMenu from "./AbstractMenu";
import TreeMenu from "./TreeMenu";
import {Menu} from 'element-ui'
import '../../styles/left.scss'

export default {
  props: {
    textColor: {default: "#000000"},
    activeTextColor: {default: "#0a0a86"},
    backgroundColor: {default: "#FFFFFF"}
  },
  extends: AbstractMenu,
  components: {TreeMenu, ElMenu: Menu}
}
</script>
