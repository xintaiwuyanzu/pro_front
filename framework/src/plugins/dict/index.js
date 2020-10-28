import dictStore from './dictStore'

/**
 * 用来注册字典相关代码
 */
export default (vue, router, store) => {
    store.registerModule('dict', dictStore)
    vue.mixin({
        methods: {
            $loadDict(type) {
                const dictStore = store.state.dict.dicts
                return new Promise((resolve, reject) => {
                    if (dictStore[type]) {
                        resolve(dictStore[type])
                    } else {
                        resolve(
                            this.$post('/sysDict/dict', {type}).then(({data}) => {
                                if (data.success) {
                                    let dictObj = {}
                                    dictObj[type] = data.data
                                    if (type === 'organise') {
                                        dictObj[type] = data.data.filter(d => d.id !== '1')
                                    }
                                    store.commit('dictLoaded', dictObj)
                                    return dictObj[type]
                                } else {
                                    return []
                                }
                            }).catch(e => reject(e))
                        )
                    }
                })
            }
        },
        mounted() {
            const promises = this.dict ? this.dict.map(d => this.$loadDict(d)) : []
            Promise.all(promises).then(() => {
                if (this.$init) {
                    this.$init()
                }
            })
        }
    })

    /**
     * 注册自定义filter
     */
    vue.filter('dict', (v, dict) => {
        if (typeof dict === 'string') {
            dict = store.state.dict.dicts[dict]
        }
        if (dict) {
            if (Array.isArray(dict)) {
                const obj = dict.find(d => d.id === v)
                if (obj) {
                    return obj.label
                }
            } else {
                if (dict[v]) {
                    return dict[v]
                }
            }
        }
        return v
    })
}
