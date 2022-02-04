import './nac.scss'
import {useMenu} from "../../hooks/useMenu";
import {useRouter} from "@u3u/vue-hooks";
import {Breadcrumb, BreadcrumbItem} from 'element-ui'

export default {
    name: 'nacInfo',
    props: {
        /**
         * 显示名称
         */
        title: {required: false, type: String, default: ''},
        /**
         * 是否显示返回按钮
         */
        back: Boolean
    },
    setup(props, context) {
        const {menuData} = useMenu()
        const {router} = useRouter()
        return () => {
            const children = []
            if (context.slots.default) {
                children.push(context.slots.default())
            }
            if (props.back) {
                children.push((<el-button onClick={() => router.back()} type="primary" size="mini">返 回 </el-button>))
            }
            return (
                <section class="breadcrumb-container">
                    <Breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>您当前的位置</el-breadcrumb-item>
                        <BreadcrumbItem class='title'>
                            {props.title || menuData.currentMenu.label || ''}
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <section class="slot">
                        {children}
                    </section>
                </section>
            )
        }
    }
}

