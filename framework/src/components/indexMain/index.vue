<template>
  <el-container :class='rootClassName'
                direction='vertical'
                v-loading="menu.menuLoading">
    <el-header :class="headerClassName">
      <header-top/>
    </el-header>
    <el-container style="overflow: auto;">
      <el-aside width="auto" :class='leftClassName' v-if="!hasHeaderMenu">
        <left-menu/>
      </el-aside>
      <el-main :class="mainClassName">
        <tabs/>
        <transition name="fade-transform" mode="out-in">
          <router-alive>
            <router-view class="main-container"/>
          </router-alive>
        </transition>
        <slot/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import './main.scss'
import vue from "vue";
import {useRoleContext} from "../../hooks/useRole";
import {useMenuContext} from "../../hooks/useMenu";
import {useUserContext} from "../../hooks/userUser";

import tabs from "./tabs";
import routerAlive from "./routerAlive";

export default {
  name: 'indexMain',
  components: {routerAlive, tabs},
  /**
   * 总共分为上左中下四个区域
   *
   *
   */
  props: {
    rootClassName: {type: String, default: 'root'},
    headerClassName: {type: String, default: 'header'},
    mainClassName: {type: String, default: 'main'},
    leftClassName: {type: String, default: 'left'},
    //菜单加载方法
    menuLoader: {type: Function},
    //用户加载方法
    userLoader: {type: Function},
    //角色加载方法
    roleLoader: {type: Function}
  },
  setup(props) {
    //登录用户上下文
    useUserContext(props.userLoader)
    //角色上下文
    const role = useRoleContext(props.roleLoader)
    //菜单上下文
    const menu = useMenuContext(props.menuLoader)
    return {menu, role}
  },
  data() {
    const hasHeaderMenu = vue.component('headerMenu')
    return {hasHeaderMenu}
  }
}
</script>