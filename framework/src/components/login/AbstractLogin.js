import {Base64} from 'js-base64'
import util from "./util";

/**
 * 登录父类，存储所有登录相关的方法
 */
export default {
    data() {
        return {
            title: document.title,
            //登录校验地址
            validatePath: 'login/validate',
            //登录表单对象
            loginForm: {
                //用户名
                username: '',
                //密码
                password: '',
                //记住密码
                rememberMe: false
            }
        }
    },
    methods: {
        /**
         * 登录方法
         * @param username
         * @param password
         */
        doLogin({username, password}) {
            if (username && password) {
                this.dataLoading = true
                this.$post(this.validatePath, {username, password: this.securityPassword(password)})
                    .then(({data}) => {
                        if (data.success) {
                            //设置前端缓存
                            util.setToken(data.data)
                            this.$message.success('登录成功！')
                            //跳转登录
                            let p = this.$router.currentRoute.query.p
                            if (!p) {
                                p = '/main/'
                            }
                            this.$router.push(p)
                        } else {
                            this.$message.error(data.message)
                        }
                        this.dataLoading = false
                    })
            } else {
                this.$message.error('请输入用户名或密码！')
            }
        },
        /**
         * 加密密码
         * @param password
         * @returns {string}
         */
        securityPassword(password) {
            return Base64.encode(password)
        },
        /**
         *尝试从cookie中读取最后登录的用户名，并设置到表单对象中
         */
        readCookie() {

        }
    },
    mounted() {
        this.readCookie()
    }
}
