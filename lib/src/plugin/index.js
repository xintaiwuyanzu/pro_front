import http from "./http";
import router from "./router";
import Vuex from "vuex";
import store from "./store";
import element from "element-ui";
import utils from "./utils";

const install = (vue, opt = {size: 'small', zIndex: 3000}) => {
    vue.use(Vuex)
    vue.use(element, opt)
}

export default {
    ...utils,
    /**
     * 网络请求相关
     */
    ...http,
    /**
     * 路由相关
     */
    ...router,
    /**
     * vuex相关
     */
    ...store,
    install
}
