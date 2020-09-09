<template>
    <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'子系统'" width="450px">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="系统名称" prop="sysName" required>
                <el-input v-model="form.sysName"></el-input>
            </el-form-item>
            <el-form-item label="系统简称" prop="shortName">
                <el-input v-model="form.shortName"></el-input>
            </el-form-item>
            <el-form-item label="IP地址" prop="ip" required>
                <el-input v-model="form.ip"></el-input>
            </el-form-item>
            <el-form-item label="访问端口" prop="port">
                <el-input v-model="form.port"></el-input>
            </el-form-item>
            <el-form-item label="系统首页" prop="homeAddress">
                <el-input v-model="form.homeAddress"></el-input>
            </el-form-item>
            <el-form-item label="系统描述" prop="sysDescription">
                <el-input type="textarea" v-model="form.sysDescription"></el-input>
            </el-form-item>
            <el-form-item label="是否可用" prop="status">
                <el-select v-model="form.status" clearable placeholder="请选择是否可用">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input v-model="form.order"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveForm" v-loading="loading">保 存</el-button>
        </div>
    </el-dialog>
</template>
<script>
  import fromMixin from '@/util/formMixin'

  export default {
    mixins: [fromMixin],
    data () {
      return {
        autoClose: true,
        path: '/subsys'
      }
    },
    methods: {
      search () {
        if (this.$parent && this.$parent.loadSyss) {
          this.$parent.loadSyss()
        }
      }
    }
  }
</script>
