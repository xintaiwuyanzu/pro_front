import vue from 'vue'
import login from './login'
import frame from './frame'
import main from './main'
import app from './app'

/**
 * 扫描指定的路径并且注册组件
 */
export function registerComponent() {
    const ctx = require.context('@/components', false, /\.vue$/)
    ctx.keys()
        .forEach(l => {
            const component = ctx(l).default
            const name = (component.name || /(\S+\/)(\S+)\.vue/.exec(l)[2])
            vue.component(name, component)
        })
}

export const login = login
export const frame = frame
export const main = main
export const app = app
