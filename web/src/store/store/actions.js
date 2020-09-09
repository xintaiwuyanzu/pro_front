import {Message} from 'element-ui'
import {Base64} from 'js-base64';

export default {
    checkLogin(context) {
        context.commit('changeLogin', true)
    },
    doLogin(context, playload) {
        if (playload && playload.username && playload.password) {
            let url = 'login/validate'
            playload.longid = playload.username

            this.$http.post(url,
                {username: playload.username, password: Base64.encode(playload.password)})
                .then(data => {
                    let body = data.data
                    if (body.success) {
                        sessionStorage.setItem('$token', body.data)
                        body.data = {}
                        body.data.id = playload.username
                        sessionStorage.setItem('uv',  JSON.stringify(body.data))
                        context.commit('login', body.data)
                        Message.success('登录成功！')
                        let p = this.$router.currentRoute.query.p
                        if (!p) {
                            if(sessionStorage.getItem('$token') === 'admin'){
                                p = '/svg/'
                            }else{
                                p = '/main/'
                            }
                        }
                        this.$router.push(p)
                    } else {
                        Message.error('登录失败，' + body.message)
                    }
                })
        } else {
            Message.error('请输入用户名或密码！')
        }
    },
    loadMenu(context, playload) {
        context.commit('menuLoading', true)
        this.$http.post('/sysmenu/menutree', playload)
            .then(({data}) => {
                if (data.success) {
                    context.commit('menuLoaded', data.data)
                }
                context.commit('menuLoading', false)
            })
    }
}