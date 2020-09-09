<template>
    <div class="breadcrumb-container" :style="style">
        <strong class="title">
            {{title?title:menu.label}}
        </strong>
        <section class="slot" style="margin-top: 3px;float: right;">
            <el-button type="success" size="mini" @click="$router.back()" v-if="back">返 回</el-button>
    <!--            <el-button type="text" round  style="float: right;font-size: 14px" v-if="back"   @click="$router.back()">返回</el-button>-->
            <slot></slot>
        </section>
    </div>
</template>
<script>
    export default {
        props: {
            title: {required: false},
            back: {required: false, default: false}
        },
        data(){
            return{
                style:{
                    height: '42px',
                    width: (window.screen.availWidth-168)+'px'
                }
            }
        }
    }
</script>
