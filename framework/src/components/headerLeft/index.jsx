/**
 * 头部左侧默认是系统名称
 */
import {useMenu} from "../../hooks/useMenu";

export default {
    name: 'headerLeft',
    setup() {
        const {menuData} = useMenu()
        const title = document.title
        return () => {
            const sys = menuData.sys
            return (<span class='title'>{sys.sysName || sys.shortName || title}</span>)
        }
    }
}