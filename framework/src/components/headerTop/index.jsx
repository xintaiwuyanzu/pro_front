import vue from "vue";

/**
 * 头部分为左中右三部分
 */
export default {
    setup() {
        const headerLeft = vue.component('headerLeft')
        const headerMenu = vue.component('headerMenu')
        const headerRight = vue.component('headerRight')
        return () => (
            <section class="header-content">
                {headerLeft ? <headerLeft class='header-left'/> : ''}
                {headerMenu ? <headerMenu class='header-middle'/> : ''}
                {headerRight ? <headerRight class='header-right'/> : ''}
            </section>
        )
    }
}

