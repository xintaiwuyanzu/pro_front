import './style.scss'
import {useTable} from "../../hooks/useTable";
import {useMenu} from "../../hooks/useMenu";

export default {
    props: {
        /**
         * 首页标题
         */
        title: [String],
        /**
         * 所有需要渲染的字段
         */
        fields: [Object, Array],
        /**
         * 所有接口基础路径
         */
        path: {type: String, required: true},
        //默认page
        pagePath: String,
        //默认delete
        deletePath: String,
        /**
         * 是否在每一行添加删除按钮
         */
        delete: {type: Boolean, default: true},
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
        defaultSearchForm: {type: Object},
        /**
         * 默认添加表单字段
         */
        defaultInsertForm: {type: Object},
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
            dialogVisible: false
        }
    },
    beforeMount() {
        this.searchFormModel = {...this.searchFormModel, ...this.defaultSearchForm}
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
    setup(props) {
        const {menuData} = useMenu()
        const result = useTable({
            basePath: props.path,
            pagePath: props.pagePath,
            deletePath: props.deletePath,
            initParams: props.defaultSearchForm
        })
        return {...result, menuData}
    },
    methods: {
        /**
         * 显示添加编辑弹窗
         * @param params
         */
        showEdit(params) {
            this.editFormModel = Object.assign({}, params)
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
                await this.loadData(this.searchFormModel)
            } else {
                this.$message.error(result.message)
            }
            this.data.loading = false
        }
    }
}