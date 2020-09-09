export default {
    user: {},
    //  登录状态 0表示未登录  1表示登录中  2表示已登录
    loginState: 0,
    menuCollapse: false,
    menuMap: new Map(),
    menuLoading: false,
    menus: [],
    dicts: {},
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
