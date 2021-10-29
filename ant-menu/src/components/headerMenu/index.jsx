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
                            <template slot="title">
                                <icon icon={md.data.icon}/>
                                <span class="stitle">{md.label}</span>
                            </template>
                            {children}
                        </Menu.SubMenu>
                    )
                } else {
                    return (
                        <Menu.Item key={md.id} onClick={() => menuData.currentMenu = md}>
                            <icon icon={md.data.icon}/>
                            <span class="stitle">{md.label}</span>
                        </Menu.Item>
                    )
                }
            })
        }
        return () => {
            const menuChildren = createChildren(menuData.menu)
            return (
                <section class="headerMenu">
                    <Menu class="menu" mode='horizontal' defaultSelectedKeys={[menuData.defaultIndex]} theme="dark">
                        {menuChildren}
                    </Menu>
                </section>
            )
        }
    }
}