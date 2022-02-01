import {Dropdown, DropdownItem, DropdownMenu, TabPane, Tabs} from 'element-ui'
import icon from "../icon";
import {useMenu} from "../../hooks/useMenu";
import './tabs.scss'

/**
 * 列表页tabs
 */
export default {
    setup() {
        const {menuData, removeTab, activeTab, clearTab} = useMenu()
        const tableRemove = v => removeTab(v)
        const tabClick = v => activeTab(v.name)
        //下拉选择点击事件
        const command = (v) => {
            if (v) {
                switch (v) {
                    case 'closeOthers':
                        clearTab(true)
                        break;
                    case 'closeAll':
                        clearTab(false)
                        break;
                    default:
                        activeTab(v)
                        break
                }
            }
        }
        return () => {
            return (
                <section class='router-nav'>
                    <Tabs type="card"
                          class='tabs'
                          on={{
                              'tab-remove': tableRemove,
                              'tab-click': tabClick
                          }}
                          value={menuData.currentMenu.id}>
                        <TabPane label='首页' name='首页'/>
                        {menuData.tabs.map(m => (<TabPane label={m.label} name={m.id} closable={true} key={m.id}/>))}
                    </Tabs>
                    <Dropdown class='btns' showTimeout={100} on={{command}}>
                        <span><icon icon='more-vertical'/></span>
                        <DropdownMenu slot='dropdown'>
                            <DropdownItem command='closeOthers'>关闭其他选项卡</DropdownItem>
                            <DropdownItem command='closeAll'>关闭所有选项卡</DropdownItem>
                            <DropdownItem divided={true}>首页</DropdownItem>
                            {
                                menuData.tabs.map(
                                    (t) => (<DropdownItem command={t.id}>{t.label}</DropdownItem>)
                                )
                            }
                        </DropdownMenu>
                    </Dropdown>
                </section>
            )
        }
    }
}