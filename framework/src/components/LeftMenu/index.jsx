import TreeMenu from "./TreeMenu";
import {Menu} from 'element-ui'
import '../../styles/left.scss'
import {useMenu} from "../../hooks/useMenu";

export default {
    setup() {
        const {menuData} = useMenu()
        return () => (
            <section class="leftMenu">
                <Menu class="menu"
                      loading={menuData.menuLoading}
                      collapse={menuData.collapse}
                      unique-opened>
                    <TreeMenu menuData={menuData.menu}/>
                </Menu>
            </section>
        )
    }
}
