/**
 * 提供table查询常用的方法
 */
import {onMounted, reactive} from "vue-demi";
import {http} from "../../plugins/http";
import {Message, MessageBox} from "element-ui";

export const useTable = (args, context) => {
    const {basePath, pagePath, deletePath, dataWrapper, autoLoadData = true} = args

    const tableData = reactive({
        data: [],
        loading: false,
        page: {
            size: 15,
            sizes: [5, 10, 15, 20, 50, 100],
            index: 0,
            total: 0,
        }
    })
    /**
     * 数据加载函数
     * @return {Promise<void>}
     */
    const loadData = async (params) => {
        let initParam = {}
        if (args.initParams) {
            if (typeof args.initParams === 'function') {
                initParam = await args.initParams()
            } else {
                initParam = args.initParams
            }
        }
        tableData.loading = true
        const queryParams = {pageSize: tableData.page.size, page: true, ...initParam, ...params}
        const result = await http().post(pagePath || `${basePath}/page`, queryParams)
        let resultData = result.data
        if (resultData && resultData.success) {
            resultData = resultData.data
            const data = reactive(resultData.data)
            if (dataWrapper) {
                await dataWrapper(data)
            }
            tableData.data = data

            tableData.page.index = parseInt(resultData.start / resultData.size) + 1
            tableData.page.size = resultData.size
            tableData.page.total = resultData.total
        }
        tableData.loading = false
        context.emit('dataLoaded', tableData, queryParams)
    }
    //启动后自动加载数据
    if (autoLoadData) {
        onMounted(() => loadData())
    }
    /**
     * 数据删除函数
     * @param params
     * @return {Promise<void>}
     */
    const remove = async (params) => {
        try {
            await MessageBox.confirm('此操作将删除选中数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
        } catch (e) {
            return
        }
        const id = Array.isArray(params) ? params.join(',') : params
        if (id) {
            tableData.loading = true
            const result = await http().post(deletePath || `${basePath}/delete`, {id, ids: id})
            if (result.data) {
                if (result.data.success) {
                    Message.success('删除成功！')
                } else {
                    Message.warning(result.data.message)
                }
            } else {
                Message.warning(result.statusText)
            }
            tableData.loading = false
            context.emit('remove', id)
        }
    }
    return {
        data: tableData,
        loadData,
        remove
    }
}