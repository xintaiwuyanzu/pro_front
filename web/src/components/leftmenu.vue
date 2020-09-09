<template>
    <section class="leftMenu">
       <!-- <div class="navBar" @click="toggleMenu()">
            <icon icon="menu" style="color: white" :class="menuCollapse?'collapse':'nocollapse'"/>
        </div>-->
        <el-menu :collapse="menuCollapse"
                 class="menu"
                 unique-opened
                 text-color="#000000"
                 active-text-color="#4846CF"
                 background-color="#FFFFFF"
                 v-loading="menuLoading">
            <tree-menu :menu-data="menus" />
        </el-menu>
    </section>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        computed: {
            ...mapState(['menuLoading'])
        }
    }
</script>
<style type="scss">
    .leftMenu {

        height: 100%;
        display: flex;
        flex-direction: column;

        .navBar {
            height: 29px;
            justify-content: center;
            display: flex;
            padding: 5px 0px;
            background-color: #303142;
            border-bottom: 1px solid #274184 !important;
            .collapse {
                width: 64px;
                transition: all .20s ease-out;
                transform: rotate(180deg);
            }

            .nocollapse {
                width: 168px;
                transition: all .20s ease-out;
                transform: rotate(90deg);
            }
        }

        .menu {
            width: 168px;
            float: left;
            background: #052578;
            overflow-x: hidden;
            overflow-y: auto;
            flex: 1;
            .el-icon{
                margin-left: 24px;
                margin-top: 19px;
                margin-bottom: 24px;
                height: 21px;
                width: 20px;
            }
            .el-submenu__title i {
                color: white;
            }

            .stitle {
                font-family: MicrosoftYaHei;
                color: #373C45;
                font-size: 15px;
                margin-left: 12px;
                margin-top: 24px;
                margin-bottom: 23px;
            }
            .el-badge {
                margin-left: 9px;
                color: #ff4b4f;
            }
        }
        .el-menu-item{

            height: 64px;

            .stitle {
                margin-top: 3px;
                line-height: 64px;
                font-family: MicrosoftYaHei;
                color: #373C45;
                font-size: 13px;
                margin-left: 12px;
            }
            .el-badge {
                margin-left: 12px;
                color: #ff4b4f;
            }
        }

        .el-menu--collapse {
            width: 64px;
            .stitle {
                width: 0;
                height: 0;
                display: none;
                margin-left: 0px;
            }

            .el-submenu__icon-arrow {
                display: none;
            }
        }
    }
    .el-menu-item.is-active {
        /*margin-left: 10px;
        margin-right: 10px;*/
        height: 64px;
        width: 151px;
        border-radius: 4px;
        background-color:#f5f9fc !important;
        .title {
            background-color: white ;
        }
    }


</style>
