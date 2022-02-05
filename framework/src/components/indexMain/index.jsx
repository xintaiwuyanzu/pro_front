import './main.scss'
import {useMenuContext} from "../../hooks/useMenu";
import vue from "vue";
import tabs from "./tabs";

export default {
    name: 'indexMain',
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
    //TODO 这里应该可以从@dr/auto 查询判断
    setup(props, {slots}) {
        const hasHeaderMenu = !vue.component('headerMenu')
        //TODO 菜单加载状态
        const {menuLoading} = useMenuContext()
        return () => {
            const children = slots.default ? slots.default() : ''
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
                            <tabs/>
                            <transition name="fade-transform" mode="out-in">
                                <keep-alive max={5}>
                                    <router-view class="main-container"/>
                                </keep-alive>
                            </transition>
                            {children}
                        </el-main>
                    </el-container>
                </el-container>
            )
        }
    }
}