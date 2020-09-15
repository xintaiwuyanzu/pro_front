import axios from 'axios'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import AsyncValidator from 'async-validator'
import {Message} from 'element-ui'
import dayjs from 'dayjs'
import {registerComponent} from "@dr/lib";

registerComponent()

// 重定向login页面
function routeLogin(options) {
    if (options.router) {
        options.router.replace({path: 'login', query: {redirect: options.router.currentRoute.fullPath}})
    }
}

function varType(n) {
    const typeStr = Object.prototype.toString.call(n);
    //var typeOfName = (typeof n);
    let typeName = '';
    switch (typeStr) {
        case '[object String]':
            typeName = 'string'
            break
        case '[object Number]':
            typeName = 'number'
            break
        case '[object Boolean]':
            typeName = 'boolean'
            break
        case '[object Undefined]':
            typeName = 'undefined'
            break
        case '[object Object]':
            typeName = 'object'
            break
        case '[object Array]':
            typeName = 'array'
            break
        case '[object Null]':
            typeName = 'null'
            break
        case '[object RegExp]':
            typeName = 'RegExp'
            break
        case '[object Symbol]':
            typeName = 'symbol'
            break
        case '[object JSON]':
            typeName = 'json'
            break
        case '[object Math]':
            typeName = 'math'
            break
        default:
            typeName = 'object'
    }
    return typeName
}

function httpInstance(options) {
    let httpInstance = axios.create({
        baseURL: options.api,
        timeout: 200000,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest(data) {
            // 用户长时间不操作即退出系统
            if (options.store.state.loginTime == 0) {
                options.store.state.loginTime = dayjs().format('x')
            } else if (dayjs().format('x') - options.store.state.loginTime > 60 * 60 * 1000) {
                options.store.state.loginTime = 0
                options.store.commit('logout')
            } else {
                options.store.state.loginTime = dayjs().format('x')
            }
            NProgress.start()
            return qs.stringify(data)
        },
        transformResponse(data) {
            NProgress.done()
            try {
                data = JSON.parse(data)
            } catch (e) {
                data = {success: false, message: '数据格式不正确'}
            }
            return data
        }
    })

    httpInstance.interceptors.request.use(config => {
        let header = config.headers
        header['dauth'] = header['$token'] = sessionStorage.getItem('$token')
        return config;
    }, err => {
        return Promise.reject(err);
    })

    httpInstance.interceptors.response.use(
        response => {
            if (response.data.message === 'needLogin') {
                routeLogin(options)
            } else {
                return response
            }
        },
        err => {
            //routeLogin(options)
            let message = `服务器错误【${err}】`
            if (err && err.message.startsWith('timeout')) {
                message = `网络请求超时，请稍候重试！`
            }
            Message.error(message)
            return Promise.resolve({data: {success: false, message}})
        })
    return httpInstance
}

export default {
    /**
     *
     * @param Vue vue全局对象
     * @param options 参数对象
     * @returns {boolean}
     */
    install(Vue, options = {api: '/api/', router: null}) {
        //  处理默认值
        if (!options.api) {
            options.api = '/api/'
        }
        if (options.router) {
            options.router.beforeEach((route, redirect, next) => {
                NProgress.start()
                next()
            })
            options.router.afterEach(() => {
                NProgress.done()
            })
        }
        Vue.prototype.$http = httpInstance(options)

        //添加登陆相关的方法
        if (options.store) {
            options.store.$router = options.router
            options.store.$http = Vue.prototype.$http
        }
        // 全局对象注入默认方法等信息
        Vue.mixin({
            computed: {
                ...mapState(['loginState', 'menuCollapse', 'treeDefaultProps', 'trueFalseOptions', 'statusOptions', 'menus']),
                ...mapGetters(['loginLoading']),
                menu() {
                    let menu = this.$store.state.menuMap.get(this.$route.path)
                    if (!menu && this.$route.params.$url) {
                        menu = this.$store.state.menuMap.get(this.$route.params.$url)
                    }
                    if (menu) {
                        sessionStorage.setItem('menu', menu.label)
                    }
                    if (!menu) {
                        menu = {}
                        menu.label = sessionStorage.getItem('menu')
                    }
                    return menu ? menu : {}
                }
            },
            methods: {
                ...mapMutations(['toggleMenu']),
                ...mapActions(['doLogin']),
                apiPath() {
                    let path = this.path
                    if (!path) {
                        let routePath = this.$route.path.split('/')
                        path = routePath[routePath.length - 1]
                    }
                    return path
                },
                $loadDict(type) {
                    let url = '/sysDict/dict'
                    return new Promise((resolve, reject) => {
                        if (options.store.state.dicts[type]) {
                            resolve(options.store.state.dicts[type])
                        } else {
                            let parm = {type}
                            if (type === "organise") {
                                url = 'gestion/getOrgDict'
                            }
                            resolve(this.$http.post(url, parm).then(({data}) => {
                                    if (data.success) {
                                        let dictObj = {}
                                        dictObj[type] = data.data
                                        options.store.commit('dictLoaded', dictObj)
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
                if (this.dict) {
                    let promises = this.dict.map(d => this.$loadDict(d))
                    Promise.all(promises).then(() => {
                        if (this.$init) {
                            this.$init()
                        }
                    })
                } else {
                    if (this.$init) {
                        this.$init()
                    }
                }
            }
        })
        // 处理validate的中文显示
        let oldMessage = AsyncValidator.prototype.messages
        AsyncValidator.prototype.messages = function (message) {
            let returnMessage = oldMessage.apply(this, message)
            if (returnMessage.required) {
                returnMessage.required = '%s 不能为空！'
            }
            return returnMessage
        }
        Vue.filter('dict', (v, dict) => {
            if (varType(dict) !== 'object') {
                dict = options.store.state.dicts[dict]
            }
            if (dict) {
                if (Array.isArray(dict)) {
                    let obj = dict.find(d => d.id == v)
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

        function fmtDate(v, fmt) {
            if (!v) {
                return v
            }
            try {
                return dayjs(parseInt(v)).format(fmt)
            } catch (e) {
                return v
            }
        }

        Vue.filter('null', (v) => (v && v !== 'null') ? v : '')
        Vue.filter('datetime', (v, fmt) => fmtDate(v, fmt ? fmt : 'YYYY-M-D H:m:s'))
        Vue.directive('focus', {
            inserted: function (el) {
                el.childNodes.forEach(e => {
                    if (e.tagName === 'INPUT' || e.tagName === 'input') {
                        e.focus()
                    }
                })
            }
        })

        //统一声明所有的字典
        const filters = {
            getUseStatus: {
                u: '在用',
                f: '在库',
                r: '维修',
                s: '报废',
                l: '借出',
                a: '申请领用'
            },
            dealResult: {
                default: '待审核',
                '0': '未通过',
                '1': '已通过'
            },
            changeResult: {
                '-1': '未开始',
                '0': '进行中',
                '1': '已通过'
            },
            checkResult: {
                'n': '正常',
                'd': '损坏',
                'l': '丢失',
                'o': '其他',
                'e': '用尽',
                'i': '在用',
                's': '未用'
            }
        }
        //统一注册所有的字典
        Object.keys(filters)
            .forEach(k => {
                const v = filters[k]
                Vue.filter(k, (filterValue) => {
                    if (v[filterValue]) {
                        return v[filterValue]
                    } else if (v.default) {
                        return v.default
                    } else {
                        return filterValue
                    }
                })
            })
    }
}
