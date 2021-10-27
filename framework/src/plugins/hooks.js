import composeApi from '@vue/composition-api'
import hooks from '@u3u/vue-hooks'

/**
 * 这里放上compose-api
 * @param vue
 */
export default (vue) => {
    vue.use(composeApi)
    vue.use(hooks)
}
