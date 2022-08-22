<template>
  <section class='router-nav'>
    <el-tabs type="card"
             class='tabs'
             @tab-remove="removeTab"
             @tab-click="navClick"
             :value="menuData.currentTab.id">
      <el-tab-pane v-for="tab in menuData.tabs"
                   :key="tab.id"
                   :label="tab.label||tab.path"
                   :name="tab.id"
                   :closable="!tab.fix"/>
    </el-tabs>
    <el-dropdown class="dropBtn" :show-timeout="100" @command="dropDownCmd">
      <span>
        <icon icon="more-vertical"/>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command='closeOthers'>
          关闭其他选项卡
        </el-dropdown-item>
        <el-dropdown-item command='closeAll'>
          关闭所有选项卡
        </el-dropdown-item>
        <el-dropdown-item v-for="tab in menuData.tabs" :key="tab.id" :command='tab.id' :divided="tab.fix">
          {{ tab.label || tab.path }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </section>
</template>
<script>
import {useMenu} from "../../hooks/useMenu";

/**
 * 列表页tabs
 */
export default {
  setup() {
    const {menuData, removeTab, removeAll, removeOthers} = useMenu()
    return {
      menuData,
      removeAll,
      removeTab,
      removeOthers,
    }
  },
  methods: {
    /**
     * 下来选择点击事件
     * @param v
     */
    dropDownCmd(v) {
      if (v) {
        switch (v) {
          case 'closeOthers':
            this.removeOthers()
            break;
          case 'closeAll':
            this.removeAll()
            break;
          default:
            this.changeTabById(v)
            break
        }
      }
    },
    changeTabById(id) {
      const tab = this.menuData.tabs.find(t => t.id === id)
      if (tab) {
        this.menuData.currentTab = tab
      }
    },
    navClick(v) {
      this.changeTabById(v.name)
    }
  }
}
</script>
<style lang="scss">
/**
导航切换tab样式
 */
.router-nav {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: $--background-color-base;
  //导航栏
  .tabs {
    flex: 1;
    overflow-x: auto;

    .el-tabs__header {
      margin: 0px;
    }

    .el-tabs__nav {
      border-width: 0px !important;
    }

    .el-tabs__item {
      padding: 0px 15px !important;
    }

    .is-active {
      background-color: #f8f8f8;
      border-width: 0px;
    }

    .el-tabs__content {
      display: none;
    }
  }

  //操作按钮
  .dropBtn {
    margin: 0px 10px;
  }
}
</style>