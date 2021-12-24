/**
 * 头部菜单
 */
import {useMenu} from "@dr/framework/src/hooks/useMenu";
import Menu from "ant-design-vue/es/menu";
import {reactive, watchEffect} from 'vue-demi'
import "./style.less";
//TODO 需要全局统一菜单和router，监听手动push的情况
export default {
    setup() {
        const {menuData} = useMenu()
        const selectedKeys = reactive({selectedKeys: []})
        watchEffect(() => {
            if (menuData.currentMenu?.id) {
                selectedKeys.selectedKeys = [menuData.currentMenu.id]
            } else {
                selectedKeys.selectedKeys = []
            }
        })

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
        const selectChange = (v) => selectedKeys.selectedKeys = v
        return () => {
            const menuChildren = createChildren(menuData.menu)
            const props = {
                mode: 'horizontal',
                theme: 'dark',
                subMenuCloseDelay: 0,
                selectedKeys: selectedKeys.selectedKeys
            }
            return (
                <section>
                    <Menu class="header-menu" props={{...props}} onSelectChange={selectChange}>
                        {menuChildren}
                    </Menu>
                </section>
            )
        }
    }
}