/**
 * 一个省事的组件，用来标引table的分页
 */
export default {
    inheritAttrs: false,
    props: {
        /**
         * 自动绑定page相关的参数
         * 分页属性
         */
        page: {type: Object}
    },
    setup(prop, context) {
        return () => {
            const args = {
                props: {
                    layout: `total, prev, pager, next${prop.page.sizes ? ',sizes' : ''}`,
                    ...context.attrs,
                    total: prop.page.total
                },
                on: {
                    //TODO vue 3.0版本有问题
                    ...context.listeners
                }
            }
            args.props['current-page'] = prop.page.index
            args.props['page-size'] = prop.page.size
            args.props['page-sizes'] = prop.page.sizes
            return <el-pagination {...args}/>
        }
    }
}
