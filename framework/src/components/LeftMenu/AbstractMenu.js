import menuStore from "./menuStore";

export default {
    computed: {
        collapse() {
            return this.$store.state.menu.collapse
        }
    },
    data() {
        return {
            defaultIndex: '',
            menus: []
        }
    },
    methods: {
        async loadMenu(params = {sysId: 'default'}) {
            this.dataLoading = true
            const data = await this.$post('/sysmenu/menutree', params)
            this.menus = data.data.data
            if (this.$route.path === '/main/') {
                let first = this.menus[0]
                if (first.children) {
                    first = first.children[0]
                }
                if (first) {
                    this.$store.commit('menuChange', first)
                    this.defaultIndex = first.id
                }
            }
            this.dataLoading = false
        },
        $init() {
            this.loadMenu()
        }
    },
    beforeMount() {
        this.$store.registerModule('menu', menuStore)
    },
    beforeDestroy() {
        this.$store.unregisterModule('menu')
    }
}
