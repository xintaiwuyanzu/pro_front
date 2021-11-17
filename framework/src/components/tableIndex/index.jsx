/**
 * 融合组件，通用列表页
 */
import formRender from '../formRender'
import tableRender, {makeArray} from '../tableRender'
import abstractTableIndex from "./abstractTableIndex";

/**
 * 过滤掉设置为false的属性，没有设置属性默认为true
 * @param arr
 * @param key
 */
function filterFalse(arr, key) {
    return arr.filter(f => {
        //所有字典默认都是可编辑的，除非手动声明edit为false
        if (Object.hasOwnProperty.call(f, key)) {
            return f[key]
        } else {
            return true
        }
    })
}

/**
 * 渲染查询表单
 * @param fields
 * @param ctx
 * @return {JSX.Element}
 */
function renderSearchForm(fields, ctx) {
    const {defaultFieldProps, ...other} = ctx.searchFormProp
    fields = fields.filter(f => f.search)
        .map(f => {
            /* eslint-disable no-unused-vars*/
            const {required, ...others} = f
            //查询表单不需要设置必填项
            return others
        })
    const slotChildren = []
    if (ctx.$scopedSlots.search) {
        ctx.$scopedSlots.search(ctx.searchFormModel)
            .forEach(v => slotChildren.push(v))
    }
    //计算操作按钮
    const btnChildren = []
    if (fields.length > 0) {
        //搜索按钮
        btnChildren.push(() =>
            (<el-button type='primary'
                        loading={ctx.data.loading}
                        onClick={() => ctx.loadData(ctx.searchFormModel)}>
                搜 索
            </el-button>)
        )
        //重置按钮
        btnChildren.push(() =>
            (<el-button type='info' onClick={() => ctx.searchForm.resetFields()}>重 置</el-button>)
        )
    }
    //添加按钮
    if (ctx.insert) {
        btnChildren.push(() =>
            (<el-button type='primary'
                        loading={ctx.data.loading}
                        onClick={() => ctx.showEdit(ctx.defaultInsertForm)}>
                添 加
            </el-button>)
        )
    }
    /**
     * 多选删除
     */
    if (ctx.deleteMulti) {
        const callBack = () => {
            const select = ctx.tableSelection
            if (!select || select.length === 0) {
                ctx.$message.warning('请选择要删除的列')
            } else {
                ctx.remove(select.map(s => s.id))
            }
        }
        btnChildren.push(() =>
            (<el-button type='danger' onClick={callBack}>删 除</el-button>)
        )
    }
    if (btnChildren.length > 0) {
        slotChildren.push(<el-form-item>{btnChildren.map(b => b(ctx.searchFormModel))}</el-form-item>)
    }
    const searchFormArgs = {
        ref: 'searchForm',
        props: {
            //过滤出来搜索的字段
            fields,
            defaultFieldProps
        },
        attrs: {
            model: ctx.searchFormModel,
            inline: true,
            ...other
        }
    }
    return (<formRender {...searchFormArgs}>{slotChildren}</formRender>)
}

/**
 * 渲染列表页面
 * @param ctx
 * @return {JSX.Element}
 */
function renderTable(columns, ctx) {
    //所有字段默认都是可编辑的，除非手动声明edit为false
    columns = filterFalse(columns, 'column')
    const propSlots = []
    if (ctx.$slots.default) {
        //自定义slots
        ctx.$slots.default.filter(v => v.componentOptions.tag === 'el-table-column')
            .forEach(v => propSlots.push(v))
    }
    let editColumnWidth = 30
    const editBtns = []
    //操作列
    if (ctx.edit) {
        //编辑按钮
        editBtns.push((scope) => {
            return (<el-button onClick={() => ctx.showEdit(scope.row)} type='text'>编辑</el-button>)
        })
        editColumnWidth += 30
    }
    if (ctx.delete) {
        //删除按钮
        editBtns.push((scope) => {
            return (<el-button onClick={() => ctx.remove(scope.row.id)} type='text'>删除</el-button>)
        })
        editColumnWidth += 30
    }
    if (ctx.$scopedSlots['table-$btns']) {
        editBtns.push(ctx.$scopedSlots['table-$btns'])
    }
    if (editBtns.length > 0) {
        const btnsColumnArgs = {
            props: {
                label: '操作',
                width: editColumnWidth + ctx.tableBtnWidth,
                align: 'center',
                'header-align': 'center',
                'show-overflow-tooltip': true
            },
            scopedSlots: {
                default: (scope) => {
                    const btnVNodes = []
                    let computeWidth = 0
                    editBtns.forEach(v => {
                        let bVs = v(scope) || []
                        if (!Array.isArray(bVs)) {
                            bVs = [bVs]
                        }
                        bVs.forEach(node => {
                            if (node.data.attrs.width) {
                                computeWidth += parseInt(node.data.attrs.width)
                            }
                            btnVNodes.push(node)
                        })
                    })
                    if (computeWidth > 0 && ctx.tableBtnWidth !== computeWidth) {
                        ctx.$nextTick(() => ctx.tableBtnWidth = computeWidth)
                    }
                    return btnVNodes
                }
            }
        }
        propSlots.push(
            <el-table-column {...btnsColumnArgs}/>
        )
    }
    //表格参数
    const tableArgs = {
        ref: 'table',
        props: {index: true, page: ctx.data.page, columns, checkAble: ctx.deleteMulti},
        attrs: {data: ctx.data.data, ...ctx.tableProp},
        on: {
            'selection-change': v => (ctx.tableSelection = v),
            'page-current-change': v => (ctx.loadData({pageIndex: v - 1})),
            'size-change': s => {
                ctx.data.page.size = s
                ctx.loadData(ctx.searchFormModel)
            }
        }
    }
    return (<tableRender {...tableArgs}>
        {propSlots}
    </tableRender>)
}

/**
 * 创建添加编辑弹窗
 * @param fields
 * @param ctx
 * @return {JSX.Element}
 */
function renderEditDialog(fields, ctx, loadingArgs) {
    if (ctx.insert || ctx.edit) {
        //所有字段默认都是可编辑的，除非手动声明edit为false
        fields = filterFalse(fields, 'edit')
        const {defaultFieldProps, ...other} = ctx.editFormProp
        const slotChildren = []
        if (ctx.$scopedSlots.edit) {
            ctx.$scopedSlots.edit(ctx.editFormModel)
                .forEach(v => slotChildren.push(v))
        }
        //添加编辑表单的字段
        const formArgs = {
            ref: 'editForm',
            props: {
                //过滤出来搜索的字段
                fields,
                defaultFieldProps
            },
            attrs: {
                model: ctx.editFormModel,
                ...other
            }
        }
        const formChild = <form-render {...formArgs} {...loadingArgs}>{slotChildren}</form-render>
        const footSlot = []
        if (ctx.$scopedSlots['edit-btns']) {
            ctx.$scopedSlots['edit-btns'](ctx.editFormModel)
                .forEach(v => footSlot.push(v))
        }
        //dialog foot
        const footerChild =
            <div slot='footer'>
                <el-button type='info' loading={ctx.data.loading} onClick={() => ctx.dialogVisible = false}>取 消
                </el-button>
                <el-button type="primary" loading={ctx.data.loading} onClick={() => ctx.submit()}>保 存</el-button>
                {footSlot}
            </div>
        const dialogArgs = {
            props: {
                ...ctx.dialogProp,
                title: ctx.dialogTitle,
                visible: ctx.dialogVisible
            },
            on: {
                'update:visible': () => {
                    ctx.dialogVisible = true
                }
            }
        }
        return (<el-dialog {...dialogArgs}>{formChild}{footerChild}</el-dialog>)
    }
}

export default {
    extends: abstractTableIndex,
    render() {
        const fields = makeArray(this.fields)
        const loadingArgs = {directives: [{name: 'loading', value: this.data.loading}]}
        //列表
        const tableChild = renderTable(fields, this, loadingArgs)
        //查询表单
        const formChild = renderSearchForm(fields, this, loadingArgs)
        //添加编辑弹窗
        const dialogChild = renderEditDialog(fields, this, loadingArgs)
        return (
            <section class='table_index' {...loadingArgs}>
                <nac-info title={this.title}>
                    {formChild}
                </nac-info>
                {tableChild}
                {dialogChild}
            </section>
        )
    }
}