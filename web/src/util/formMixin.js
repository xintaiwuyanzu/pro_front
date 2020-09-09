export default {
    data () {
        return {
            //  是否正在编辑（dialog）
            edit: false,
            //  是否正在加载数据
            loading: false,
            //  是否保存后关闭弹窗
            autoClose: false,
            //  查询表单对象
            searchForm: {},
            //  编辑表单对象
            form: {},
            //最开始传进来的编辑表单的数据
            editFormData: {},
            //  编辑表单校验规则
            rules: {}
        }
    },
    methods: {
        /**
         *尝试根据搜索表单条件调用父组件搜索
         */
        search () {
            this.searchForm.pageIndex = 0
            this.$store.commit('setSearchForm', this.searchForm)
            this.$store.commit('setSearchFormUrl',this.$route.path)
            if (this.$parent && this.$parent.loadData) {
                this.$parent.loadData(this.getSearchForm())
            }else{
                // 如果form获取不到父组件的loadData方法，则采用事件的方式进行触发加载数据
                this.$emit('search', this.getSearchForm())
            }
        },
        getSearchForm (param) {
            return Object.assign({}, this.searchForm, param)
        },
        /**
         *编辑表单
         * @param formData
         */
        editForm (formData) {
            if (formData) {
                this.editFormData = Object.assign({}, formData)
                this.form = Object.assign({}, formData)
            } else {
                this.editFormData = {}
                this.initForm()
            }
            this.edit = true
        },
        /**
         *保存表单
         */
        saveForm () {
            if (this.$refs.form) {
                this.loading = true
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let path = this.apiPath()
                        if (this.form.id) {
                            path = path + '/update'
                        } else {
                            path = path + '/insert'
                        }
                        this.$http.post(path, this.form).then(({data}) => {
                            if (data && data.success) {
                                this.form = data.data
                                this.$message.success('保存成功！')
                                if (this.autoClose) {
                                    this.cancel()
                                }
                                if (this.$parent && this.$parent.loadData) {
                                    this.$parent.loadData(this.getSearchForm())
                                }else{
                                    // 如果form获取不到父组件的loadData方法，则采用事件的方式进行触发加载数据
                                    this.$emit('search', this.getSearchForm())
                                }
                            } else {
                                this.$message.error(data.message)
                            }
                            this.loading = false
                        })
                    } else {
                        this.loading = false
                    }
                })
            }
        },
        /**
         * 取消编辑弹窗
         */
        cancel () {
            if (this.$refs.form) {
                this.$refs.form.resetFields()
                this.edit = false
            }
        },
        /**
         * 初始化表单数据
         */
        initForm () {
            if (this.defaultForm) {
                this.form = Object.assign({}, this.defaultForm)
            } else {
                this.form = {}
            }
        },
        multiply(a, b) {
            let m = 0,
                c = a.toString(),
                d = b.toString();
            try {
                m += c.split(".")[1].length
            } catch (e) {
            }
            try {
                m += d.split(".")[1].length
            } catch (e) {
            }
            return Number(c.replace(".", "")) * Number(d.replace(".", "")) / Math.pow(10, m)
        }
    },
    mounted () {
        this.initForm()
    }
}
