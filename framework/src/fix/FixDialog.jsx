import {Dialog} from 'element-ui'
import {getCurrentInstance, nextTick, onMounted, onUnmounted, watch} from "vue";

function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function parsePx(px) {
    if (typeof px === 'string') {
        return parseFloat(px.replace('px', '')).toFixed(2)
    }
    return px
}

export default {
    props: {
        //增加是否自动调整内容高度属性
        autoHeight: {default: true, type: Boolean}
    },
    extends: Dialog,
    setup(prop) {
        //ref dialog htmlElement对象，使用ref(null)获取不到
        let dialog = null
        if (prop.autoHeight) {
            /**
             * 动态计算dialog body的最大高度
             */
            const doAppend = () => {
                //弹窗显示的时候才计算
                if (dialog) {
                    const dialogBodyEl = dialog.querySelector('div.el-dialog__body')
                    if (dialogBodyEl) {
                        //先获取窗口高度
                        let bodyMaxHeight = getWindowHeight()
                        //获取dialog组件样式
                        const dialogStyle = getComputedStyle(dialog)
                        //减去上边距
                        bodyMaxHeight -= parsePx(dialogStyle.marginTop)
                        //减去下边距
                        bodyMaxHeight -= parsePx(dialogStyle.marginBottom)
                        const dialogHeaderEl = dialog.querySelector('div.el-dialog__header')
                        if (dialogHeaderEl) {
                            //减去header高度
                            bodyMaxHeight -= dialogHeaderEl.clientHeight
                        }
                        const dialogFooterEl = dialog.querySelector('div.el-dialog__footer')
                        if (dialogFooterEl) {
                            //减去footer高度
                            bodyMaxHeight -= dialogFooterEl.clientHeight
                        }
                        //TODO 这个值不知道是怎么漏掉的
                        bodyMaxHeight -= 60;
                        dialogBodyEl.style.setProperty('overflow', 'auto')
                        //设置最高高度
                        dialogBodyEl.style.setProperty('max-height', parseFloat(bodyMaxHeight).toFixed(2) + 'px')
                    }
                }
            }

            const appendBodyStyle = () => {
                if (prop.visible) {
                    nextTick(doAppend)
                }
            }
            watch(() => prop.visible, appendBodyStyle)
            onMounted(() => {
                const currentInstance = getCurrentInstance()
                if (currentInstance && currentInstance.proxy && currentInstance.proxy.$refs) {
                    dialog = currentInstance.proxy.$refs.dialog
                }
                window.addEventListener('resize', appendBodyStyle)
            })
            onUnmounted(() => window.removeEventListener('resize', appendBodyStyle))
        }
    }
}