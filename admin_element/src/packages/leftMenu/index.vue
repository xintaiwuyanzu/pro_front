<template>
  <section class="leftMenu">
    <div class="navBar" @click="toggleMenu()">
      <icon icon="menu" style="color: white" :class="menuCollapse?'collapse':'nocollapse'"/>
    </div>
    <el-menu :collapse="menuCollapse"
             class="menu"
             text-color="#fff"
             active-text-color="gray"
             background-color="#1e89db"
             v-loading="loading">
      <tree-menu :menu-data="menus"/>
    </el-menu>
  </section>
</template>
<script>
import TreeMenu from './treeMenu'

export default {
  name: 'leftMenu',
  components: {TreeMenu},
  data() {
    return {
      loading: false
    }
  },
  methods: {
    loadMenus() {
      this.loading = true
      this.$store.dispatch('loadMenu', {all: true}).then(() => this.loading = false)
    }
  },
  mounted() {
    this.loadMenus()
  }
}
</script>
<style scoped type="scss">
.leftMenu {
  height: 100%;
  display: flex;
  flex-direction: column;

  .navBar {
    height: 20px;
    justify-content: center;
    display: flex;
    padding: 5px 0px;
    background-color: #1973c3;

    .collapse {
      transition: all .20s ease-out;
      transform: rotate(180deg);
    }

    .nocollapse {
      transition: all .20s ease-out;
      transform: rotate(90deg);
    }
  }

  .menu {
    background: linear-gradient(180deg, #1e89db, #1973c3);
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
  }
}
</style>
