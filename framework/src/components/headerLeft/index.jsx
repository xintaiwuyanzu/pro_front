/**
 * 头部左侧默认是系统名称
 */

export default {
    name: 'headerLeft',
    setup() {
        const title = document.title
        return () => (<span class='title'>{title}</span>)
    }
}