<template>
  <section class="leftMenu">
    <el-menu class="menu"
             :loading="dataLoading"
             :collapse="collapse"
             unique-opened>
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
  extends: AbstractMenu,
  components: {TreeMenu, ElMenu: Menu}
}
</script>
