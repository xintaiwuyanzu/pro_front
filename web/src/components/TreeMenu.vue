<template>
    <section>
        <el-submenu :index="menu.id" v-if="menu.children" v-for="menu in menuData" :key="menu.id">
            <template slot="title">
                <icon :icon="menu.data.icon" style="color: black"/>
                <span slot="title" class="stitle">{{menu.label}}</span>
            </template>
            <TreeMenu :menuData="menu.children"></TreeMenu>
        </el-submenu>
        <el-menu-item :index="menu.id" v-else @click="$store.commit('menuChange', menu)">
            <icon :icon="menu.data.icon" style="color: black"/>
            <span slot="title" class="stitle">{{menu.label}}</span>
        </el-menu-item>
    </section>
</template>
<script>
  export default {
    name: 'TreeMenu',
    props: {
      menuData: Array
    }
  }
</script>

