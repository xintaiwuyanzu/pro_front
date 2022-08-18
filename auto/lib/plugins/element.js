import {elements} from '@dr/auto'
import utils from '@dr/auto/lib/utils'
import {InfiniteScroll, Loading, Message, MessageBox, Notification} from 'element-ui'
import 'element-ui/packages/theme-chalk/src/common/transition.scss'

export default (vue, router, store, opt = {}) => {
    vue.prototype.$ELEMENT = {
        size: opt.size || 'small',
        zIndex: opt.zIndex || 2000
    }

    vue.use(InfiniteScroll)
    vue.use(Loading.directive);

    vue.prototype.$loading = Loading.service;
    vue.prototype.$msgbox = MessageBox;
    vue.prototype.$alert = MessageBox.alert;
    vue.prototype.$confirm = MessageBox.confirm;
    vue.prototype.$prompt = MessageBox.prompt;
    vue.prototype.$notify = Notification;
    vue.prototype.$message = Message;
    //是否懒加载element的css样式
    const lazyCss = opt.lazyCss ? opt.lazyCss : true
    //将element组件注册成异步组件
    elements.forEach(e => {
        vue.component(e.name, lazyCss ? utils.makeSync(e.component, e.css) : utils.makeSync(e.component))
    })

}
