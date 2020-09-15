let libs = []
let parks = []
let buildings = []
let orgs = []
let counts = []
let assetsType = []
export default {
    props: {
        showSearch: {default: true},
        query: {
            type: Object, default() {
                return {}
            }
        }
    },
    watch: {
        query(v) {
            if (v) {
                this.loadMenus(v)
            }
        }
    },
    filters: {
        getLibOne(v) {
            if (v) {
                let lib = libs.find(d => d.id === v)
                if (lib) {
                    return lib.organiseName
                }
            }
        },
        getParks(v) {
            if (v) {
                let park = parks.find(d => d.id === v)
                if (park) {
                    return park.parkName
                }
            }
        },
        getBuildings(v) {
            if (v) {
                let building = buildings.find(d => d.id === v)
                if (building) {
                    return building.buildingName
                }
            }
        },
        getOrgs(v) {
            if (v) {
                let org = orgs.find(d => d.id === v)
                if (org) {
                    return org.organiseName
                }
            }
        },
        getCount(v) {
            if (v) {
                let count = counts.find(d => d.houseID === v)
                if (count) {
                    return count.id
                }
            }
        },
        getAssetsType(v) {
            if (v) {
                let type = assetsType.find(d => d.code === v)
                if (type) {
                    return type.name
                }
            }
        }
    },
    data() {
        return {
            data: [],
            page: {
                size: 15,
                index: 0,
                total: 0
            },
            selectIds: [],
            loading: false,
            notFeeUser: ['0059']
        }
    },
    methods: {
        /**
         * 编辑或新增表单
         * @param form
         */
        editForm(form) {
            if (this.$refs.form) {
                this.$refs.form.editForm(form)
            }
        },
        /**
         *根据传入的参数加载数据
         * @param params
         */
        loadData(params, useSearchForm) {
            this.loading = true
            if (useSearchForm && this.$refs.form && this.$refs.form.getSearchForm) {
                params = this.$refs.form.getSearchForm(params)
            }
            this.$http.post(this.apiPath() + '/page', params).then(({data}) => {
                if (data && data.success) {
                    this.data = data.data.data
                    this.page.index = data.data.start / data.data.size + 1
                    this.page.size = data.data.size
                    this.page.total = data.data.total
                    if (this.$refs.form) {
                        this.$refs.form.searchForm = Object.assign(this.$refs.form.searchForm, {pageIndex: this.page.index - 1})
                    }
                }
                this.loading = false
            })
        },
        /**
         *删除指定的数据
         * @param id 指定的数据或者true
         */
        remove(id) {
            this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = []
                if (id === true) {
                    ids = [...this.selectIds]
                } else if (id) {
                    ids = [id]
                }
                if (ids.length > 0) {
                    this.loading = true
                    this.$http.post(this.apiPath() + '/delete', {id: ids.join(',')})
                        .then(({data}) => {
                            if (data.success) {
                                this.$message.success('删除成功！')
                                this.selectIds = []
                                this.loadData()
                            } else {
                                this.$message.error(data.message)
                                this.loading = false
                            }
                        })
                } else {
                    this.$message.warning('请选择要删除的数据列！')
                }
            })

        },
        handleTableSelect(row) {
            this.selectIds = row.map(r => r.id)
        },
        getlibs() {
            this.$http.post('library/page', {page: false}).then(({data}) => {
                if (data.success) {
                    libs = data.data
                } else {
                    this.$message.error(data.message)
                }
            })
        },
        getParkList() {
            this.$http.post('park/getAllPark').then(({data}) => {
                if (data.success) {
                    parks = data.data
                } else {
                    this.$message.error(data.message)
                }
            })
        },
        getBuildList() {
            this.$http.post('building/getAllBuilding').then(({data}) => {
                if (data.success) {
                    buildings = data.data
                } else {
                    this.$message.error(data.message)
                }
            })
        },
        getOrgList() {
            this.loading = true
            this.$http.post('organise/getAllDepartment').then(({data}) => {
                if (data.success) {
                    orgs = data.data
                }
                this.loading = false
            })
        },
        getCountList() {
            this.$http.post('housePerson/getCountByHouseId').then(({data}) => {
                if (data.success) {
                    counts = data.data
                } else {
                    this.$message.error(data.message)
                }
            })
        },
        getAssetsTypeList() {
            this.$http.post('assetsType/page', {parentCode: 'root', page: false}).then(({data}) => {
                if (data.success) {
                    assetsType = data.data
                } else {
                    this.$message.error(data.message)
                }
            })
        }
    }
}
