import {useTable} from "../../hooks/useTable";
import {useMenu} from "../../hooks/useMenu";

export default {
    props: {
        /**
         * 首页标题
         */
        title: [String],
        /**
         * 是否显示标题
         */
        showTitle: {type: Boolean, default: true},
        /**
         * 所有需要渲染的字段
         */
        fields: [Object, Array],
        /**
         * 所有接口基础路径
         */
        path: {type: String, required: true},
        /**
         * 分页查询后台请求路径
         * 默认page
         */
        pagePath: String,
        /**
         *  删除后台请求路径
         *  默认delete
         */
        deletePath: String,
        /**
         *分页查询返回结果映射方法
         * 函数类型，参数是后台返回的分页数据的list，方法返回结果没用到
         *
         * 注意：这个参数只是用来处理异步处理数据的场景，正常不需要使用该参数。
         *      需要同步监听可以使用 dataLoaded 事件监听
         */
        dataWrapper: Function,
        /**
         * 是否在每一行添加删除按钮
         */
        delete: {type: Boolean, default: true},
        /**
         *是否显示多选
         */
        checkAble: {type: Boolean, default: false},
        /**
         * 是否支持多选删除
         */
        deleteMulti: {type: Boolean, default: false},
        /**
         * 可以自定义table属性
         */
        tableProp: {type: Object, default: () => ({})},
        /**
         * 可以自定义表单属性
         */
        searchFormProp: {type: Object, default: () => ({})},
        /**
         * 添加默认搜索条件
         */
        defaultSearchForm: {type: [Array, Object, Function]},
        /**
         * 默认添加表单字段
         */
        defaultInsertForm: {type: Object},
        /**
         * 后台方法带回来的数据太多，在编辑的时候过滤掉指定的字段
         * 不再往后台发送
         */
        editFilterFields: {type: Array, required: false},
        /**
         * 添加编辑表单属性
         */
        editFormProp: {type: Object, default: () => ({labelWidth: '120px'})},
        dialogProp: {type: Object, default: () => ({})},
        /**
         * 是否在上方右侧添加添加按钮
         */
        insert: {type: Boolean, default: true},
        //默认insert
        insertPath: String,
        /**
         * 是否在每一行操作栏添加编辑按钮
         */
        edit: {type: Boolean, default: true},
        //默认update
        updatePath: String,
        /**
         * 是否有返回按钮
         */
        back: {type: Boolean, default: false}
    },
    data() {
        return {
            /**
             * 表格选中的数据
             */
            tableSelection: [],
            /**
             * 查询表单对象
             */
            searchFormModel: {},
            /**
             * 操作列宽度，这个需要根据自定义的slot动态运算
             */
            tableBtnWidth: 0,
            /**
             * 添加和编辑表单对象
             */
            editFormModel: {},
            /**
             * 添加编辑dialog显示状态
             */
            dialogVisible: false,
            deactivated: false
        }
    },
    computed: {
        /**
         * table-render对象
         * @return {Vue | Element | (Vue | Element)[]}
         */
        table() {
            return this.$refs.table
        },
        /**
         * 查询表单form-render对象
         * @return {Vue | Element | (Vue | Element)[]}
         */
        searchForm() {
            return this.$refs.searchForm
        },
        /**
         * 编辑表单form-render对象
         * @return {Vue | Element | (Vue | Element)[]}
         */
        editForm() {
            return this.$refs.editForm
        },
        /**
         * 弹窗标题
         * @return {string}
         */
        dialogTitle() {
            let title = this.title || (this.menuData.currentMenu ? this.menuData.currentMenu.label : '') || ''
            if (title.endsWith('管理')) {
                title = title.substr(0, title.length - 2)
            }
            return `${this.editFormModel.id ? '编辑' : '添加'}${title}`
        }
    },
    setup(props, context) {
        const {menuData} = useMenu()
        const result = useTable({
            basePath: props.path,
            pagePath: props.pagePath,
            deletePath: props.deletePath,
            initParams: props.defaultSearchForm,
            dataWrapper: props.dataWrapper,
            autoLoadData: false
        }, context)
        return {...result, menuData}
    },
    methods: {
        /**
         * 显示添加编辑弹窗
         * @param params
         */
        showEdit(params) {
            if (this.editFilterFields) {
                const tempModel = {}
                for (const key in params) {
                    if (!this.editFilterFields.includes(key)) {
                        tempModel[key] = params[key]
                    }
                }
                this.editFormModel = tempModel
            } else {
                this.editFormModel = Object.assign({}, params)
            }
            this.$emit('editShow', this.editFormModel)
            this.dialogVisible = true
        },
        /**
         * 提交表单
         * @return {Promise<void>}
         */
        async submit() {
            this.data.loading = true
            const url = this.editFormModel.id ? (this.updatePath ? this.updatePath : this.path + "/update") : (this.insertPath ? this.insertPath : this.path + "/insert")
            const result = await this.editForm.submit(url)
            if (result.success) {
                this.$message.success('保存成功！')
                this.dialogVisible = false
                await this.reload()
            } else {
                this.$message.error(result.message)
            }
            this.data.loading = false
        },
        /**
         * 刷新数据方法
         * @returns {Promise<void>}
         */
        async reload() {
            await this.loadData(this.searchFormModel)
        }
    },
    async mounted() {
        if (this.delete || this.deleteMulti) {
            //监听数据删除事件，刷新数据
            this.$on('remove', async id => {
                if (id) {
                    await this.reload()
                }
            })
        }
        //初始化搜索表单
        let initParam = {}
        if (this.defaultSearchForm) {
            if (typeof this.defaultSearchForm === 'function') {
                initParam = await this.defaultSearchForm()
            } else {
                initParam = this.defaultSearchForm
            }
        }
        Object.keys(initParam).forEach(k => this.$set(this.searchFormModel, k, initParam[k]))
        //加载数据
        await this.reload()
    },
    async activated() {
        if (this.deactivated) {
            await this.reload()
        }
    },
    deactivated() {
        this.deactivated = true
    }
}