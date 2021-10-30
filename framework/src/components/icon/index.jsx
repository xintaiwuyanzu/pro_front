import vueIcon from 'vue-icon/lib/vue-feather.esm'
import './style.scss'

/**
 * TODO 将来可以引入svg icon，但是没想还怎么保证包大小
 */
export default {
    props: {icon: String, default: {type: String, default: 'setting'}},
    render() {
        let icon = this.icon
        if (!icon) {
            icon = 'el-icon-setting'
        }
        if (icon.startsWith('el-icon')) {
            return <i class={icon} title={icon}/>
        } else {
            return <vueIcon name={icon} class={'el-icon svg-icon-' + icon}/>
        }
    }
}