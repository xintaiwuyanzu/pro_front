import {useMenu} from "../../hooks/useMenu";

export default {
    name: 'TreeMenu',
    props: {
        menuData: {type: Array, default: () => []}
    },
    setup(props) {
        const {menuData} = useMenu()
        return () => (
            <section>
                {props.menuData.map(m => {
                    if (m.children) {
                        return (
                            <el-submenu index={m.id}>
                                <template slot="title">
                                    <icon icon={m.data.icon}/>
                                    <span slot="title" class="stitle">{m.label}</span>
                                </template>
                                <TreeMenu menuData={m.children}/>
                            </el-submenu>
                        )
                    } else {
                        return (
                            <el-menu-item index={m.id} onClick={() => menuData.currentMenu = m}>
                                <icon icon={m.data.icon}/>
                                <span slot="title" class="stitle">{m.label}</span>
                            </el-menu-item>
                        )
                    }
                })
                }
            </section>
        )
    }
}