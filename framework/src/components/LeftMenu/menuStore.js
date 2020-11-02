/**
 *菜单相关的store实现
 */
export default {
    state: {
        menus: [],
        currentMenu: {},
        collapse: false,
    },
    mutations: {
        menuChange(state, menu) {
            state.currentMenu = menu
            state.collapse = false
            let url = menu.data.url
            if (url) {
                //过滤重复跳转
                if (this.$router.currentRoute.path !== url) {
                    if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
                        this.$router.push({name: 'frame', params: {$url: url}, query: {$url: url}})
                    } else {
                        this.$router.push(menu.data.url)
                    }
                }
            }
        },
        toggleMenu(state) {
            state.collapse = !state.collapse
        },
        openMenu(state) {
            state.collapse = false
        },
        closeMenu(state) {
            state.collapse = true
        }
    }
}
