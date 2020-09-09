<template>
    <el-container class="main">
        <el-header class="header">
            <header-top></header-top>
        </el-header>
        <el-container style="overflow: auto;">
            <el-aside width="auto" style="padding: 0px">
                <leftmenu></leftmenu>
            </el-aside>
            <el-main style="padding: 0px;">
                <transition name="fade-transform" mode="out-in">
                    <router-view class="main-container"></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import headerTop from '../components/header'
    import Leftmenu from '../components/leftmenu'

    export default {
        components: {Leftmenu, headerTop},
    }
</script>

<style type="scss">
    .main {
        height: 100%;
        .header {
            background-image: linear-gradient(90deg,
                    rgba(100, 145, 255, 0.79) 0%,
                    rgba(100, 145, 255, 0.4) 40%,
                    #6491ff 100%),
            linear-gradient(
                            #737aff,
                            #737aff);
            color: #fff;
            vertical-align: middle;
        }

        .main-container {
            width: 100%;
            height: 100%;
            overflow: auto;
            display: flex;
            flex-direction: column;

                strong{
                    width: 68px;
                    height: 15px;
                    font-family: MicrosoftYaHei;
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 28px;
                    letter-spacing: 1px;
                    color: #373c45;
                }


            .breadcrumb-container {
                display: inline-block;
                background: #f3f4fc;
                border-top-right-radius: 4px;
                border-top-left-radius: 4px;
                width: 100%;
                position: fixed;
                z-index:50;
                strong {
                    z-index:51;
                }
                section {
                    z-index:99;
                    button {
                        z-index:999;
                    }
                }
                .title {
                    padding: 8px;
                    float: left;
                    height: 12px;
                    font-family: MicrosoftYaHei;
                    font-size: 14px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 28px;
                    letter-spacing: 1px;
                    color: #373c45;
                }
                .slot {
                    float: left;
                    padding: 4px 6px;

                    .el-button {
                        padding: 8px 15px;
                    }

                    .el-form-item {
                        margin-bottom: 0px;
                        margin-right: 0px;
                    }
                }
            }

            .searchForm {
                padding: 5px;

                .el-form-item {
                    margin-bottom: 5px;
                }
            }

            .index_main {
                display: flex;
                flex-direction: column;
                flex: 1;
                padding: 40px 5px 5px 5px;
                margin-top: 8px;

                .table-container {
                    flex: 1;
                    overflow: auto;
                }

                .el-pagination {
                    text-align: right;
                }

                .form_detail {
                    .el-form-item {
                        margin-bottom: 4px;
                    }
                }
            }
        }
    }

    .card {
        .el-card {
            margin: 5px 2px;
            .el-form {
                .el-form-item {
                    width: auto;
                    margin-bottom: 10px;
                }
            }
            .el-card__header, .el-card__body {
                padding: 10px;
                clear: both;
            }
        }
    }
</style>
