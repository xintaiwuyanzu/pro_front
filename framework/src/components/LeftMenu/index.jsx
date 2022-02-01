import {Menu, MenuItem, Submenu} from 'element-ui'
import {useMenu} from "../../hooks/useMenu";
import icon from "../icon";
import './left.scss'

export default {
    setup() {
        const {menuData, addTab} = useMenu()
        const toggle = () => menuData.collapse = !menuData.collapse
        return () => (
            <section class="leftMenu">
                <Menu class={`menu ${menuData.collapse ? 'close' : ''}`}
                      defaultActive={menuData.currentMenu.id}
                      loading={menuData.menuLoading}
                      collapse={true}
                      unique-opened>
                    <MenuItem on={{click: toggle}} class='left-item'>
                        <icon icon='menu'/>
                    </MenuItem>
                    {createSubMenu(menuData.menu, menuData, addTab)}
                </Menu>
            </section>
        )
    }
}

const createSubMenu = (m, menuData, addTab) => {
    return m.map(item => {
        if (item.children) {
            return (
                <Submenu index={item.id}
                         popperOptions={{boundariesPadding: 0, gpuAcceleration: false}}
                         boundariesPadding={0}
                         showTimeout={0}
                         hideTimeout={200}
                         popperClass="left-menu-pop">
                    <template slot="title">
                        <icon icon={item.data.icon}/>
                        <span class='text'>{item.label}</span>
                    </template>
                    <MenuItem index={item.id} disabled={true} class='menu-header'>{item.label}</MenuItem>
                    {createSubMenu(item.children, menuData, addTab)}
                </Submenu>
            )
        } else {
            return (
                <MenuItem index={item.id} onClick={() => addTab(item)} class='left-item'>
                    <icon icon={item.data.icon}/>
                    <span class='text'>{item.label}</span>
                </MenuItem>
            )
        }
    })
}