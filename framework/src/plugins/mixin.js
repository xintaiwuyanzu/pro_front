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
            apiPath() {
                let path = this.path
                if (!path) {
                    const routePath = this.$route.path.split('/')
                    path = routePath[routePath.length - 1]
                }
                return path
            }
        }
    })
}
