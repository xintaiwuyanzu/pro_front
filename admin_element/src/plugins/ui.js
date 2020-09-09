import '../styles/index.scss'
import ElementUI from 'element-ui'
import icon from '../packages/icon'
import iconSelect from '../packages/iconSelect'
import leftMenu from '../packages/leftMenu'
import navInfo from '../packages/navInfo'
import App from '../packages/app'
import Logo from '../packages/logo'
import HeaderTop from '../packages/headerTop'
import Vue from 'vue'

/**
 * 全局注册的组件
 */
const components = {
    icon,
    iconSelect,
    leftMenu,
    navInfo,
    Logo,
    HeaderTop
}
let config;
const mount = ({el} = {el: '#app'}) => {
    const instance = new Vue(
        Object.assign({render: h => h(App)}, config)
    )
    instance.$mount(el)
    return instance
}
/**
 * 所有控件
 */
const exports = {
    ...components,
    App,
    mount
}

/**
 * vue插件安装方法
 * @param vue
 * @param ops
 */
const install = (vue, ops) => {
    //安装各个控件
    Object.values(components).forEach(c => vue.component(c.name, c))
    //安装element
    vue.use(ElementUI, ops.elOption || {size: 'small', zIndex: 3000})
    //缓存全局配置
    config = ops
}
export default {
    install,
    exports
}
