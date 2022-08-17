/**
 * 一个省事的组件，用来标引table的分页
 */
export default {
    name: 'page',
    inheritAttrs: false,
    props: {
        /**
         * 自动绑定page相关的参数
         * 分页属性
         */
        page: {type: Object}
    },
    render() {
        const args = {
            props: {
                layout: `total, prev, pager, next,jumper${this.page.sizes ? ',sizes' : ''}`,
                ...this.$attrs,
                total: this.page.total
            },
            on: {
                ...this.$listeners
            }
        }
        args.props['current-page'] = this.page.index
        args.props['page-size'] = this.page.size
        args.props['page-sizes'] = this.page.sizes
        return (<el-pagination {...args}/>)
    }
}
