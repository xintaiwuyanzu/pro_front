<template>
    <el-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')+'机构'" width="70%" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" inline>
            <el-row :gutter="30">
                <el-col :span="24">
                    <el-col :span="12" :lg="8">
                        <el-form-item label="机构名称" prop="organiseName" required>
                            <el-input v-model="form.organiseName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="机构代码" prop="organiseCode" required>
                            <el-input v-model="form.organiseCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="原机构名称" prop="organiseOldName">
                            <el-input v-model="form.organiseOldName"/>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12" :lg="8">
                        <el-form-item label="机构类型" prop="organiseType">
                            <select-dict type="org.type" v-model="form.organiseType" placeholder="请选择机构类型"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="机构属性" prop="organiseAttribute">
                            <select-dict type="org.organiseAttribute" v-model="form.organiseAttribute"
                                         placeholder="请选择机构属性"/>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12" :lg="8">
                        <el-form-item label="联系人名称" prop="concatName">
                            <el-input v-model="form.concatName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="form.phone" @input.native="handleClick"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="联系手机" prop="mobile">
                            <el-input v-model="form.mobile" @input.native="handleClick"/>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12" :lg="8">
                        <el-form-item label="办公地点" prop="address">
                            <el-input type="textarea" v-model="form.address"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="简介" prop="summary">
                            <el-input type="textarea" v-model="form.summary"/>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12" :lg="8">
                        <el-form-item label="排序" prop="order">
                            <el-input-number v-model="form.order" label="排序"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :lg="8">
                        <el-form-item label="状态" prop="status">
                            <select-dict type="orgStatus" v-model="form.status" placeholder="请选择机构状态"/>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveForm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import fromMixin from '@dr/auto/lib/util/formMixin'

export default {
    data() {
        return {
            autoClose: true,
            form: {phone: '', mobile: ''},
        }
    },
    methods: {
        handleClick() {
            this.$nextTick(() => {
                this.form.phone = this.form.phone.replace(/[^\d]/g, '')
                this.form.mobile = this.form.mobile.replace(/[^\d]/g, '')
            })
        },
        search() {
            if (this.$parent && this.$parent.loadMenus) {
                this.$parent.loadMenus()
            }
        }
    },
    mixins: [fromMixin]
}
</script>
<style scoped>
.el-dialog .el-form-item {
    display: flex;
}

/deep/.el-dialog  .el-form-item__content {
    flex: 1;
}

/deep/.el-dialog  .el-select {
    width: 100%;
}

/deep/.el-dialog .el-input-number {
    width: 100%;
}

/deep/.el-dialog .el-form-item__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>