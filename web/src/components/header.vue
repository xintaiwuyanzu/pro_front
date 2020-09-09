<template>
    <section style="height: 100%;display: flex;align-content: center">
            <HeaderLogo style="margin-top: auto;margin-bottom: auto " img="margin-right: 10px"/>
        <div style="flex: 1"/>
        <section class="section" style="float: right;margin-top: 15px;">
            <span effect="dark" style="margin-right: 5px;height:30px;padding: 4px;float: left;">
                {{ $store.state.user.userName}}
            </span>
            <el-tooltip content="个人信息" placement="bottom" effect="light">
                <el-button circle size="mini" style="margin-right: 10px;height:30px;padding: 4px;float: left"
                           @click="getChange($store.state.user)">
                    <icon icon="user" style="width: 20px"/>
                </el-button>
            </el-tooltip>
            <el-tooltip content="退出登录" placement="bottom" effect="light">
                <el-button circle size="mini" style="margin-right: 15px;height:30px;padding: 4px;float: left"
                           @click="logout()">
                    <icon icon="delete" style="width: 20px"/>
                </el-button>
            </el-tooltip>
            <el-tooltip content="切换模式" placement="bottom" effect="light">
                <el-button circle size="mini" style="margin-right: 15px;height:30px;padding: 4px;float: left"
                           @click="changeModel()">
                    <icon icon="circle" style="width: 20px"/>
                </el-button>
            </el-tooltip>
            <change-form ref="changeform"/>
            <changepwd-form ref="changepwdform"/>
        </section>
        </section>
</template>
<script>
    import changeForm from './changeForm'
    import changepwdForm from './changePwdForm'
    import HeaderLogo from './Logo'


    export default {
        components: {changeForm, changepwdForm, HeaderLogo},
        data() {
            return {
                baseUrl: process.env.BASE_URL + 'imgs/',
                sysId: 'default',
                options: [],
            }
        },
        computed: {
            subSys() {
                let sys = this.options.find(d => d.id == this.sysId)
                return sys ? sys : {}
            }
        },
        methods: {
            download: url => url ? window.open(url) : '',
            loadMenu(id, remain) {
                if (id === 'user') {
                    this.$store.commit('logout')
                } else {
                    let sys = this.subSys
                    if (sys.homeAddress) {
                        window.open(sys.homeAddress)
                    } else {
                        sessionStorage.setItem('sysId', id)
                        if (!remain) {
                            this.$router.push('/main/')
                        }
                        this.$nextTick(() => {
                            this.$store.dispatch('loadMenu', {sysId: id, all: false})
                        })
                    }
                }
            },
            $init() {
                this.$http.post('/subsys/page?page=false')
                    .then(({data}) => {
                        if (data.success) {
                            this.options = data.data.sort((a, b) => a.order - b.order)
                            if (sessionStorage.getItem('sysId')) {
                                this.sysId = sessionStorage.getItem('sysId')
                            } else {
                                this.sysId = 'default'
                            }
                            this.loadMenu(this.sysId, true)
                        }
                    })
            },
            logout() {
                this.$store.commit('logout');
            },
            getChange(row) {
                this.$refs.changeform.editForm(row)
            },
            changePwds() {
                this.$refs.changepwdform.editForm()
            },
            changeModel(){
                if(this.$router.currentRoute.path.startsWith('/main/')){
                    this.$router.push('/svg/')
                }else{
                    this.$router.push('/main/')
                }
            }

        }
    }
</script>
<style type="scss">
    .section {
        .per{
            width: 126px;
            height: 76px;
            border-bottom: 2px solid #2d79f0;
            border-radius: 2px;
            float: left;
        }
        .person {
            margin-top: 25px;
            margin-left: 8px;
            margin-right: 18px;
            font-size: 12px;
            line-height: 80px;
            color: #ffffff;
          /*  margin-bottom: 10px;*/
        }
        .personImg{
            margin-left: 18px;
            float: left
        }
        .el-select{
            width: 160px;
            height:30px;
            float: left;
            margin-top: 13px;
            margin-bottom: 24px;
            margin-right: 18px;
            border-color: #dde7f1;
        }
        .exit{
            margin-right: 20px;
            float: left;
            border-bottom: 2px solid #2d79f0;
            width: 64px;
            height: 76px
        }
        .divider{
            float: left;
            margin-top: 25px;
            margin-bottom: 18px;
            margin-left: 18px;
            margin-right: 18px;
            height: 37px;
        }
    }
</style>

