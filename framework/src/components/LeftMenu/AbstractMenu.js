import menuStore from "./menuStore";

export default {
    computed: {
        collapse() {
            return this.$store.state.menu.collapse
        }
    },
    data() {
        return {
            menus: []
        }
    },
    methods: {
        loadMenu(params = {sysId: 'default'}) {
            this.dataLoading = true
            this.$post('/sysmenu/menutree', params)
                .then(({data}) => {
                    if (data.success) {
                        this.menus = data.data
                    }
                    this.dataLoading = false
                })
        }
    },
    mounted() {
        this.loadMenu()
    },
    beforeMount() {
        this.$store.registerModule('menu', menuStore)
    },
    beforeDestroy() {
        this.$store.unregisterModule('menu')
    }
}
