import {RouteConfig} from "vue-router";
import {AsyncComponent} from "vue/types/umd";
import {Module, Store} from "vuex";
import {Vue} from "vue/types/vue";
import {VueRouter} from "vue-router/types/router";

type components = {
    name: string
    component: AsyncComponent
}[]
type views = RouteConfig[]
/**
 * 所有的store modules
 */
type stores = { name: string, value: Module<any, any> }[]
/**
 * element-ui对象
 */
type elements = { name: string, component: AsyncComponent, css: Promise<any> }[]

type plugins = { name: string, value(vue: Vue, router: VueRouter, store: Store<any>, opt: any) }[]
