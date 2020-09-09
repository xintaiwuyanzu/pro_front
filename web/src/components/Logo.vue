<template>
    <section class="logo">
        <img :src="imgUrl" :style="imgStyle"/>
        <span :style="textStyle">{{text}}</span>
    </section>
</template>
<script>

    const fontSize = [22, 25, 25, 27, 29]


    export default {
        props: {
            /**
             * logo类型，总共1  2  3三种图标类型
             */
            type: {
                type: Number,
                default: 1
            },
            /**
             * 可以自定义图标
             */
            icon: {
                type: String,
                default: ""
            },
            /**
             * 文字名称，没有的话取html title
             */
            title: {
                type: String
            },
            /**
             * 大小，1-6  6种大小
             */
            size: {
                type: Number,
                default: 3
            },
            /**
             * 字体颜色
             */
            color: {
                type: String,
                default: 'white'
            },
            /**
             * 字体样式
             */
            fontStyle: {
                type: String,
                default: ''
            },
            img: {}
        },
        computed: {
            imgStyle() {
                return this.img
            },
            text() {
                return this.title || document.title
            },
            textStyle() {
                let fz = fontSize[this.type]
                if (!fz) {
                    fz = 31
                }
                return `font-weight: normal;
                font-family: NotoSansHans-Regular;
                font-stretch: normal;
                letter-spacing: 5px;
                color:${this.color};
                font-size:${fz}px;
                ${this.fontStyle}`
            },
            imgUrl() {
                if (this.icon != '') {
                    return require("../" + this.icon);
                } else {
                    return require(`../assets/logo/icon${this.type}/icon${this.size}.png`);
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .logo {
        align-items: center;
        display: table;

        > img, > span {
            display: table-cell;
            vertical-align: middle
        }
    }

</style>
