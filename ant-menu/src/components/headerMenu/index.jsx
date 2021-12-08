/**
 * 头部菜单
 */
import {useMenu} from "@dr/framework/src/hooks/useMenu";
import Menu from "ant-design-vue/es/menu";
import "./style.less";

export default {
    setup() {
        const {menuData} = useMenu()
        const createChildren = data => {
            return data.map(md => {
                if (md.children) {
                    const children = createChildren(md.children)
                    return (
                        <Menu.SubMenu key={md.id}>
                            {
                                md.data.icon ?
                                    <template slot="title">
                                        <icon class='header-icon' icon={md.data.icon}/>
                                        {md.label}
                                    </template>
                                    :
                                    <template slot="title">{md.label}</template>
                            }
                            {children}
                        </Menu.SubMenu>
                    )
                } else {
                    return (
                        <Menu.Item key={md.id} onClick={() => menuData.currentMenu = md}>
                            {md.data.icon ? <icon class='header-icon' icon={md.data.icon}/> : ''}
                            {md.label}
                        </Menu.Item>
                    )
                }
            })
        }
        return () => {
            const menuChildren = createChildren(menuData.menu)
            return (
                <section>
                    <Menu class="header-menu" mode='horizontal' defaultSelectedKeys={[menuData.defaultIndex]}
                          subMenuCloseDelay={0}
                          theme="dark">
                        {menuChildren}
                    </Menu>
                </section>
            )
        }
    }
}