<template>
    <section>
        <el-input :value="value" v-model="value" style="width: 300px" :placeholder="placeholder" clearable filterable>
            <el-button slot="append" v-on:click="getType" icon="el-icon-search"></el-button>
        </el-input>
        <el-dialog title="选择资产采购信息（双击代码）"  width="800px" :visible.sync="show" customClass="customWidth"  :append-to-body="true">
            <el-form inline>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="合同编码：" >
                            <el-input v-model="value" clearable placeholder="请输入名称合同编码"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="名称：" >
                            <el-input v-model="purchaseName" clearable placeholder="请输入名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-button type="primary" @click="getType" size="mini">搜 索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="data" border height="100%" @row-dblclick="selectOne">
                <el-table-column prop="code" label="合同编码"  align="center"/>
                <el-table-column prop="purchaseName" label="合同名称" align="center"/>
            </el-table>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        props: {
            id: {type: String},
            placeholder: {type: String},
            value: {type: String}
        },
        model: {event: 'selected', prop: 'id'},
        data() {
            return {
                data: [],
                show: false,
                purchaseName:''
            }
        },
        methods: {
            getType() {
                this.$http.post('/assetsPurchase/page?page=true&code=' + this.value+'&purchaseName=' + this.purchaseName)
                    .then(({data}) => {
                        if (data.success) {
                            this.data = data.data.data
                            this.loading = false
                            this.show = true
                        }
                    })
            },
            selectOne(row){
                this.$emit('selectPurchase', row)
                this.value = row.code
                this.show = false
                this.data = []
            }
        }

    }
</script>
