import axios from 'axios'

const install = (vue, ops) => {
    vue.prototype.$http = axios
}

export default {install}
