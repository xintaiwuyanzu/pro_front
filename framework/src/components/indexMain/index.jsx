import './main.scss'
import {useMenuContext} from "../../hooks/useMenu";
import vue from "vue";

export default {
    /**
     * 总共分为上左中下四个区域
     *
     *
     */
    props: {
        rootClassName: {type: String, default: 'root'},
        headerClassName: {type: String, default: 'header'},
        mainClassName: {type: String, default: 'main'},
        leftClassName: {type: String, default: 'left'}
    },
    setup(props) {
        const hasHeaderMenu = !vue.component('headerMenu')
        //TODO 菜单加载状态
        const {menuLoading} = useMenuContext()
        return () => {
            const directives = [{name: 'loading', value: menuLoading, modifiers: {fullscreen: true}}]
            return (
                <el-container class={props.rootClassName} direction='vertical' {...{directives}}>
                    <el-header class={props.headerClassName}>
                        <header-top/>
                    </el-header>
                    <el-container style="overflow: auto;">
                        {
                            hasHeaderMenu ?
                                <el-aside width="auto" style="padding: 0px" class={props.leftClassName}>
                                    <left-menu/>
                                </el-aside> : ''
                        }
                        <el-main style="padding: 0px;" class={props.mainClassName}>
                            <transition name="fade-transform" mode="out-in">
                                <router-view class="main-container"/>
                            </transition>
                        </el-main>
                    </el-container>
                </el-container>
            )
        }
    }
}