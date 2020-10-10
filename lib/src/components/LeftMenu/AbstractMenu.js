export default {
    data() {
        return {
            menus: []
        }
    },
    methods: {
        loadMenu(params = {sysId: 'default'}) {
            this.loading = true
            this.$post('/sysmenu/menutree', params)
                .then(({data}) => {
                    if (data.success) {
                        this.menus = data.data
                    }
                    this.loading = false
                })
        }
    },
    mounted() {
        this.loadMenu()
    }
}
