import {useMenu} from "../hooks/useMenu";
import {useRouter} from "@u3u/vue-hooks";
import {ref, unref} from "vue-demi";

export default {
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
        let title = ref(props.title);
        return () => {
            if (!props.title) {
                if (menuData.currentMenu) {
                    title.value = menuData.currentMenu.label
                } else {
                    title.value = ''
                }
            }
            return (
                <div class="breadcrumb-container">
                    <strong class="title">{unref(title)} </strong>
                    <section class="slot">
                        {context.slots.default ? context.slots.default() : ''}
                        {
                            props.back ?
                                <el-button onClick={() => router.back()} type="success" size="mini">返 回
                                </el-button> :
                                ''
                        }
                    </section>
                </div>
            )
        }
    }
}

