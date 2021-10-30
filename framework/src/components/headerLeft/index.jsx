/**
 * 头部左侧默认是系统名称
 */

export default {
    setup() {
        const title = document.title
        return () => (<span class='title'>{title}</span>)
    }
}