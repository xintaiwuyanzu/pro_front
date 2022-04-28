export default (vue) => {
    //等各种基础状态变量
    vue.mixin({
        data() {
            return {
                dataLoading: false,
                //常用属性
                treeDefaultProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                trueFalseOptions: [
                    {value: true, label: '是'},
                    {value: false, label: '否'}
                ],
                statusOptions: [
                    {value: '1', label: '是'},
                    {value: '0', label: '否'}
                ]
            }
        },
        methods: {
            /**
             * 后台基础访问路径
             * @returns {string}
             */
            apiPath() {
                let path = this.path
                if (!path) {
                    const routePath = this.$route.path.split('/')
                    path = routePath[routePath.length - 1]
                }
                return path
            },
            /**
             *去掉路径最后面的/
             * @param p
             * @returns {string|*}
             */
            fixPath(p) {
                if (p) {
                    if (p.endsWith('/')) {
                        return p.substring(0, p.length - 1)
                    } else {
                        return p
                    }
                } else {
                    return p
                }
            }
        }
    })
}
