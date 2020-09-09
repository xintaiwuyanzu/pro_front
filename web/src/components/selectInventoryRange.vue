<template>
    <section>
        <el-input v-model="names"  type="textarea" disabled style="width: 260px" placeholder="请选择盘点范围：" clearable  filterable/>
        <el-button  v-on:click="getType"  >选择盘点范围</el-button>
        <el-dialog title="选择盘点资产范围"  width="400px" :visible.sync="show" customClass="customWidth"  :append-to-body="true">
            <el-form inline>
                <el-row>
                    <el-tree :data="data"
                             show-checkbox
                             node-key="id"
                             :props="defaultProps"
                             ref="typeTree"
                             :default-checked-keys="ids">
                    </el-tree>
                </el-row>
                <el-row>
                    <el-col :span="10" offset="16">
                        <el-button  @click="show=false" >取消</el-button>
                        <el-button  type="primary" @click="saselectTypes" >保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        props: {
            id: {type: String},
            label: label,
            placeholder: {type: String},
            value: {type: String},
            inventoryId:{type: String},
            ids:[],
            names:{}
        },
        data() {
            return {
                data: [],
                show: false,
                defaultProps: {
                    id:'id',
                    children: 'children',
                    label: 'label'
                },
                oldIds:[]
            }
        },
        methods: {
            getType() {
                this.show = true
                this.$http.post('/assetsType/getTypeTree')
                    .then(({data}) => {
                        if (data.success) {
                            this.data = data.data
                            this.loading = false
                        }
                    })
                if(this.inventoryId){
                    this.$http.post('/assetsInventory/getRange',{inventoryId:this.inventoryId})
                        .then(({data}) => {
                            if (data.success) {
                                this.ids = []
                                this.oldIds = []
                                data.data.forEach(v=>{
                                    this.ids.push(v.id)
                                    this.oldIds.push(v.id)
                                })
                                this.loading = false
                            }
                        })
                }
            },

            saselectTypes(){
                this.names = []
                let array = this.$refs.typeTree.getCheckedNodes()
                this.ids = []
                array.forEach(v=>{
                    if(v.children.length==0){
                        this.ids.push(v.id)
                        this.names.push(v.label)
                    }
                })
                let data={ids:this.ids,names:this.names}
                if(this.oldIds !== this.ids){
                    data.change=true
                }
                this.$emit('selectTypes', data)
                this.show=false
            },
        }

    }
</script>
