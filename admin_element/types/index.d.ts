import {DComponent} from './component';
import {NavInfo} from './navInfo';
import {Moment} from 'moment/moment';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from './axios';
import {MomentFormatSpecification, MomentInput} from 'moment';
import {PluginObject} from 'vue';

/**
 * 扩展Vue的属性和定义
 */
declare module 'vue/types/vue' {
    interface Vue {
        /**
         * 创建日期对象，所有参数都是可选的
         * @param inp
         * @param format
         * @param strict
         */
        $moment(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;

        /**
         * 创建日期对象，所有参数都是可选的
         * @param inp
         * @param format
         * @param language
         * @param strict
         */
        $moment(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

        /**
         * http请求对象
         */
        $http: AxiosInstance;

        /**
         * 直接根据http请求对象发起get请求
         * @param url
         * @param config
         */
        $get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

        /**
         * 直接根据http请求对象发起post请求
         * @param url
         * @param data
         * @param config
         */
        $post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

        /**
         *
         */
        $init(): Promise<any>;

    }
}
export type Component = DComponent

export class N extends NavInfo {
}

/**
 * elementui配置项，组件大小
 */
declare enum sizeEnum {
    large = 'large',
    medium = 'medium',
    small = 'small',
    mini = 'mini'
}

/**
 * elementUi配置项
 */
interface elementOption {
    size?: sizeEnum
    zIndex?: number
}

/**
 * 组件库安装配置项
 */
interface installOption {
    elOption?: elementOption
}

export interface Dlib extends PluginObject<installOption> {

}
