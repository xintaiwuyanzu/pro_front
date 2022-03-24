<template>
  <section>
    <nac-info title="菜单管理">
      <el-form inline style="padding-top: 5px">
        <el-form-item label="请选择系统：" style="margin-right: 10px">
          <el-select v-model="sysId" ref="sysSelect">
            <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.sysName">
              <span style="float: left">{{ item.sysName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.sysDescription }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" v-show="menuData.length===0" @click="editMenu">添加菜单
          </el-button>
        </el-form-item>
      </el-form>
    </nac-info>
    <div class="index_main sysMenu">
      <el-tree class="sysMenuTree"
               :data="menuData"
               :props="treeDefaultProps"
               v-loading="treaLoading"
               default-expand-all
               :filter-node-method="filterNode"
               ref="menuTree">
        <div style="flex: 1;margin: 2px;" slot-scope="{ node, data }">
          <el-tag style="float: left;font-size: 16px"
                  :type="data.data.status==='0'?'danger':(data.data.leaf?'':'warning')">
            <icon style="margin-right: 5px;width: 16px;height: 16px" :icon="data.data.icon" v-if="data.data.icon"/>
            <span>{{ data.label }}</span>
          </el-tag>
          <span class="buttons">
                  <el-button v-if="data.level===0" type="primary" size="mini" @click="editMenu">
                    添加同级
                  </el-button>
                  <el-button v-if="!data.data.leaf" type="primary" size="mini" @click="editMenu({parentId: data.id})">
                    添加子目录
                  </el-button>
                  <el-button v-if="!data.data.leaf" type="primary" size="mini"
                             @click="editMenu({parentId: data.id,leaf:true})">
                    添加子菜单
                  </el-button>
                  <el-button type="primary" size="mini"
                             @click="editMenuParent(data.data)">
                    修改父级
                  </el-button>
                  <el-button type="primary" size="mini" @click="editMenu(data.data)">
                    编辑
                  </el-button>
                  <el-button type="warning" size="mini" @click="toggle(data)">
                    {{ data.data.status === '1' ? '禁用' : '启用' }}
                  </el-button>
                  <el-button type="danger" size="mini" v-if="node.childNodes.length===0" @click="remove(data.id)">
                    删除
                  </el-button>
                </span>
        </div>
      </el-tree>
    </div>
    <sys-menu-form :resources="menuData" ref="sysMenu"/>
  </section>
</template>
<script>
import SysMenuForm from './form'

/**
 * TODO 这里的数据修改后需要刷新右侧菜单
 */
export default {
  role: ['admin'],
  components: {SysMenuForm},
  data() {
    return {
      options: [],
      sysId: 'default',
      filterText: '',
      treaLoading: false,
      menuData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    },
    sysId() {
      this.loadData()
    }
  },
  methods: {
    async $init() {
      await this.loadSyss()
      await this.loadData()
      if (this.$refs.menuTree && this.filterText) {
        this.$refs.menuTree.filter(this.filterText)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async loadSyss() {
      const {data} = await this.$http.post('/subsys/page?page=false')
      if (data.success) {
        this.options = data.data
        if (!this.sysId) {
          this.sysId = 'default'
        }
      }
    },
    async loadData() {
      this.treaLoading = true
      this.menuData = []
      const {data} = await this.$http.post('/sysmenu/menutree', {all: true, sysId: this.sysId})
      if (data.success) {
        let list = data.data ? data.data : []
        for (let i = 0; i < list.length; i++) {
          //TODO 这里为什么要把隐藏的菜单去掉？？
          //if (list[i].data.status == 1) {
          this.menuData.push(list[i])
          //}
        }
      }
      this.treaLoading = false
    },
    editMenuParent(menu) {
      let formData = {
        sysId: this.sysId,
        parentId: this.sysId,
        sysName: this.$refs.sysSelect.selectedLabel,
        status: '1',
        leaf: false,
        order: 1
      }
      if (menu) {
        formData = Object.assign(formData, menu)
      }
      this.$refs.sysMenu.editParentForm(formData)
    },
    editMenu(menu) {
      let formData = {
        sysId: this.sysId,
        parentId: this.sysId,
        sysName: this.$refs.sysSelect.selectedLabel,
        status: '1',
        leaf: false,
        order: 1
      }
      if (menu) {
        formData = Object.assign(formData, menu)
      }
      this.$refs.sysMenu.editForm(formData)
    },
    async remove(id) {
      await this.$confirm('确定要删除该菜单吗？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      this.treaLoading = true
      const data = await this.$http.post('/sysmenu/delete', {id})
      if (data.data.success) {
        this.$message.success('删除成功！')
      }
      await this.loadData()
    },
    async toggle(data) {
      const status = data.data.status === '1' ? '0' : '1'
      await this.$confirm(`确定要${status === '1' ? '启用' : '禁用'}菜单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.treaLoading = true
      const result = await this.$http.post('/sysmenu/update', Object.assign({}, data.data, {status}))
      if (result.data.success) {
        this.$message.success('操作成功！')
      }
      this.loadData()
    }
  }
}
</script>
<style lang="scss">
.sysMenu {
  padding-top: 50px;
}

.sysMenuTree {
  height: 100%;
  overflow: auto;

  .el-tree-node__content {
    height: auto;

    .buttons {
      float: right;
    }
  }
}
</style>
