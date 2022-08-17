<template>
  <section>
    <nac-info :title="(id?'编辑':'添加')+'权限'" back>
      <el-button type="primary" @click="save">保存</el-button>
    </nac-info>
    <div class="index_main">
      <form-render style="padding: 10px 20px" :fields="fields" :model="form" label-width="120px" ref="form">
        <el-form-item prop="code" required label="权限编码">
          <span slot="label">
            权限编码
            <el-tooltip content="选择权限" placement="right">
              <el-button icon="el-icon-search" type="success" circle size="mini" @click="showSearchDialog"/>
            </el-tooltip>
          </span>
          <el-dialog :visible.sync="dialogShow" title="选择权限" width="80%">
            <resource-tree :resources="resources" :parts="parts" ref="tree" :code="form.code"/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogShow = false">取 消</el-button>
              <el-button type="primary" @click="readCode">确 定</el-button>
            </span>
          </el-dialog>
          <el-input type="textarea" v-model="form.code" clearable/>
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input v-model="form.order" type="number" placeholder="请输入排序"/>
        </el-form-item>
      </form-render>
    </div>
  </section>
</template>
<script>
import abstractResource from "../abstractResource";
import resourceTree from './resourceTree'

export default {
  data() {
    return {
      id: this.$route.query.id,
      self: false,
      form: {
        type: '',
        groupId: '',
        code: '',
        order: 0
      },
      dialogShow: false
    }
  },
  computed: {
    fields() {
      return [
        {prop: 'name', label: '权限名称', required: true},
        {prop: 'description', label: '描述', type: 'textarea'},
        {
          prop: 'type',
          label: '权限类型',
          required: true,
          disabled: !!this.id,
          filterable: true,
          fieldType: 'select',
          mapper: this.providers,
          valueKey: 'type',
          labelKey: 'name',
          on: {
            change: () => {
              this.form.groupId = ''
            }
          }
        },
        {
          prop: 'groupId',
          disabled: !!this.id,
          label: '权限分组',
          required: true,
          show: this.groups.length > 1,
          fieldType: 'select',
          mapper: this.groups,
          filterable: true,
          valueKey: 'id',
          labelKey: 'name',
        }
      ]
    },
    resourceType() {
      return this.form.type
    }
  },
  methods: {
    async save() {
      const result = await this.$refs.form.submit(`/sysPermission/${this.id ? 'update' : 'insert'}`)
      if (result.success) {
        this.$message.success(result.message)
        this.$router.back()
      } else {
        this.$message.error(result.message)
      }
    },
    async $init() {
      this.id = this.$route.query.id
      await this.loadResourceProvider()
      if (this.id) {
        const {data} = await this.$post('/sysPermission/detail', {id: this.id})
        this.form = data.data
      }
    },
    readCode() {
      this.form.code = this.$refs.tree.getCode()
      this.dialogShow = false
    },
    async doShow() {
      await this.loadResource(this.form.type, this.form.groupId)
      if (this.resources.length > 0) {
        if (this.$refs.tree && this.$refs.tree.$init) {
          this.$refs.tree.$init(this.form.code)
        }
        this.dialogShow = true
      } else {
        this.$message.warning('未找到指定权限和分组的资源')
      }
    },
    showSearchDialog() {
      if (!this.form.type) {
        this.$message.warning("请选择权限类型")
      } else if (this.groups.length > 1) {
        if (this.form.groupId) {
          if (this.form.groupId === '*') {
            this.$message.warning("所有分组不能选择权限")
          } else {
            this.doShow()
          }
        } else {
          this.$message.warning("请选择权限分组")
        }
      } else {
        this.doShow()
      }
    }
  },
  extends: abstractResource,
  components: {resourceTree}
}
</script>
