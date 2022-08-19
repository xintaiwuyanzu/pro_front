import {Menu, MenuItem, Submenu} from 'element-ui'
import {useMenu} from "../../hooks/useMenu";
import icon from "../icon";
import './left.scss'

export default {
    setup() {
        const {menuData} = useMenu()
        const toggle = () => menuData.collapse = !menuData.collapse
        const routeByMenu = (menu) => menuData.currentMenu = menu
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
                    {createSubMenu(menuData.menu, menuData, routeByMenu)}
                </Menu>
            </section>
        )
    }
}

const createSubMenu = (m, menuData, menuClick) => {
    return m.map(item => {
        if (item.children) {
            const subClick = () => {
                if (item.children.length === 1) {
                    menuClick(item.children[0])
                }
            }
            return (
                <Submenu index={item.id}
                         popperOptions={{boundariesPadding: 0, gpuAcceleration: false}}
                         boundariesPadding={0}
                         showTimeout={200}
                         nativeOnClick={subClick}
                         popperClass="left-menu-pop">
                    <template slot="title">
                        <icon icon={item.data.icon} title={item.label}/>
                        <span class='text'>{item.label}</span>
                    </template>
                    <MenuItem index={item.id} disabled={true} class='menu-header'>{item.label}</MenuItem>
                    {createSubMenu(item.children, menuData, menuClick)}
                </Submenu>
            )
        } else {
            return (
                <MenuItem index={item.id} class='left-item' on={{click: () => menuClick(item)}} title={item.label}>
                    <icon icon={item.data.icon} title={item.label}/>
                    <span class='text'>{item.label}</span>
                </MenuItem>
            )
        }
    })
}