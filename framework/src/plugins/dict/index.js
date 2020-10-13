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
        }
    })
}
