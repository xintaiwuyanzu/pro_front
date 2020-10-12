import {RouteConfig} from "vue-router";
import {AsyncComponent} from "vue/types/umd";
import {Module, Store} from "vuex";
import {Vue} from "vue/types/vue";
import {VueRouter} from "vue-router/types/router";
import {AxiosInstance} from "axios";

type components = {
    name: string
    component: AsyncComponent
}[]
type views = RouteConfig[]

type stores = { name: string, value: Module<any, any> }[]

type plugins = { name: string, value(vue: Vue, router: VueRouter, store: Store<any>, http: AxiosInstance) }[]

