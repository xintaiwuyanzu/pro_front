/**
 *菜单相关的store实现
 */
export default {
    state: {
        menus: [],
        currentMenu: {}
    },
    mutations: {
        menuChange(state, menu) {
            state.currentMenu = menu
            let url = menu.data.url
            if (url) {
                if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
                    this.$router.push({name: 'frame', params: {$url: url}, query: {$url: url}})
                } else {
                    this.$router.push(menu.data.url)
                }
            }
        }
    }
}
