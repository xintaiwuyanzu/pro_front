<template>
    <section>
        <el-input :value="value" v-model="value" style="width: 260px" :placeholder="placeholder" clearable filterable>
            <el-button slot="append" v-on:click="getRoom" icon="el-icon-search"></el-button>
        </el-input>
        <el-dialog title="选择房间信息（双击代码）"  width="700px" :visible.sync="show" customClass="customWidth"  :append-to-body="true">
            <el-form inline>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="房间号：" >
                            <el-input v-model="value" clearable placeholder="请输入房间号"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="楼层：" >
                            <el-input v-model="name" clearable placeholder="请输入所属楼层"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-button type="primary" @click="getRoom" size="mini">搜 索</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>

            </el-form>
            <el-table :data="data" border max-height="500px" style="overflow: auto" @row-dblclick="selectOne">
                <el-table-column prop="roomCode" label="房间号"  align="center"/>
                <el-table-column prop="floorNum" label="楼层" align="center"/>
            </el-table>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        props: {
            id: {code: String},
            placeholder: {code: String},
            value: {code: String}
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
            getRoom() {
                let path = '/housePerson/getRoomByPersonId?personId='+ this.$store.state.user.id
                if(this.value != null && this.value !== ''){
                    path = path + '&roomCode=' + this.value
                }
                if(this.name != null && this.name !== ''){
                    path = path + '&floorNum=' + this.name
                }
                console.log(path)
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
                console.log(row)
                this.$emit('selectPlace', row)
                this.value = row.roomCode
                this.show = false
                this.data = []
            }
        }

    }
</script>
