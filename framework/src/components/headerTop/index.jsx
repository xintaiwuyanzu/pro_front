import Logout from './logout'
import vue from "vue";

/**
 * TODO  logo等其他参数
 */
export default {
    components: {Logout},
    props: {
        /**
         * 标题
         */
        title: {type: String, required: false},
        /**
         * 是否显示登出按钮
         */
        logout: {default: true}
    },
    setup(props) {
        const headerMenu = vue.component('headerMenu')
        return () => (
            <section class="header-content">
                <div style="margin-left: auto;display: flex;justify-content: center">
                    {headerMenu ? <headerMenu/> : ''}
                    {props.logout ? <Logout/> : ''}
                </div>
            </section>
        )
    }
}

