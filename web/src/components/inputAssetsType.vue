<template>
    <section>
        <el-input :value="value" v-model="value" style="width: 300px" :placeholder="placeholder" clearable filterable>
            <el-button slot="append" v-on:click="getType" icon="el-icon-search"></el-button>
        </el-input>
        <el-dialog title="选择资产分类信息（双击代码）"  width="700px" :visible.sync="show" customClass="customWidth"  :append-to-body="true">
            <el-form inline>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="编码：" >
                            <el-input v-model="value" clearable placeholder="请输入编码"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item label="名称：" >
                            <el-input v-model="name" clearable placeholder="请输入名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-button type="primary" @click="getType" size="mini">搜 索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <el-table :data="data" border max-height="500" @row-dblclick="selectOne">
                <el-table-column prop="code" label="分类编码"  align="center"/>
                <el-table-column prop="name" label="分类名称" align="center"/>
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
                value: '',
                show: false,
                name:''
            }
        },
        methods: {
            getType() {
                let path = '/assetsType/page?page=true'
                if(this.value != null && this.value !== ''){
                    path = path + '&code=' + this.value
                }
                if(this.name != null && this.name !== ''){
                    path = path + '&name=' + this.name
                }
                this.$http.post(path)
                    .then(({data}) => {
                        if (data.success) {
                            this.data = data.data.data
                            this.loading = false
                            this.show = true
                        }
                    })
            },
            selectOne(row){
                this.$emit('selectType', row)
                this.value = row.code
                this.show = false
                this.data = []
            }
        }

    }
</script>
