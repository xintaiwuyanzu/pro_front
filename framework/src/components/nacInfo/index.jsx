import './nac.scss'
import {useMenu} from "../../hooks/useMenu";
import {useRouter} from "@u3u/vue-hooks";
import {Breadcrumb, BreadcrumbItem} from 'element-ui'
import {onBeforeUnmount, watch} from "vue-demi";
import {trimUrl} from "../../hooks/useMenu/utils";

export default {
    name: 'nacInfo',
    props: {
        /**
         * 显示名称
         */
        title: {required: false, type: String, default: ''},
        /**
         * 是否显示标题
         */
        showTitle: {type: Boolean, default: true},
        /**
         * 是否显示返回按钮
         */
        back: Boolean
    },
    provide() {
        return {
            nacInfo: this
        };
    },
    setup(props, context) {
        const {menuData, setName} = useMenu()
        const {router, route} = useRouter()
        let isRunning = true
        onBeforeUnmount(() => isRunning = false)

        const checkAndSetName = () => {
            if (props.title && isRunning) {
                setName(props.title, trimUrl(route.value.path))
            }
        }
        watch(() => props.title, checkAndSetName)
        checkAndSetName()
        return () => {
            const children = []
            if (context.slots.default) {
                children.push(context.slots.default())
            }
            if (props.back) {
                children.push((<el-button onClick={() => router.back()} type="primary" size="mini">返 回 </el-button>))
            }

            const title = props.showTitle ?
                <Breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>您当前的位置</el-breadcrumb-item>
                    <BreadcrumbItem class='title'>
                        {props.title || menuData.currentTab.label || ''}
                    </BreadcrumbItem>
                </Breadcrumb>
                : ''
            return (
                <section class="breadcrumb-container">
                    {title}
                    <section class="slot">
                        {children}
                    </section>
                </section>
            )
        }
    }
}

