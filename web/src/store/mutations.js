function parseTree(map, menu, parent) {
    if (menu) {
        menu.forEach(m => {
            m.indexs = parent ? [...parent.indexs, m.id] : [m.id]
            map.set(m.data.url, m)
            if (m.children) {
                parseTree(map, m.children, m)
            }
        })
    }
}

export default {
    logout(state) {
        sessionStorage.removeItem('uv')
        state.user = {}
        this.$router.push('login')
    },
    login(state, user) {
        if(user.id){
            this.$http.post('/login/info')
                .then(({data}) => {
                    if (data.success) {
                        state.user = data.data
                        state.isLogin = 2
                    }
                })
        }
    },
    changeLogin(state, isLogin) {
        state.isLogin = isLogin
    },
    toggleMenu(state, isCollapse) {
        if (isCollapse === undefined) {
            isCollapse = !state.menuCollapse
        }
        state.menuCollapse = isCollapse
    },
    menuLoading(state, loading) {
        state.menuLoading = loading
    },
    menuLoaded(state, menu) {
        state.menus = menu
        state.menuMap.clear()
        parseTree(state.menuMap, menu)
        if (this.$router.currentRoute.path === '/main/') {
            if (menu && menu.length > 0 && menu[0].children && menu[0].children.length > 0) {
                this.$router.push(menu[0].children[0].data.url)
            }
        }
    },
    menuChange(state, menu) {
        let url = menu.data.url
        if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
            this.$router.push({name: 'frame', params: {$url: url}, query: {$url: url}})
        } else {
            this.$router.push(menu.data.url)
        }
    },
    dictLoaded(state, dict) {
        if (dict) {
            state.dicts = Object.assign(state.dicts, dict)
        }
    }
}
