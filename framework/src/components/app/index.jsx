import "./normal.css";
import 'html5-boilerplate/dist/css/main.css'
import 'html5-boilerplate/dist/css/normalize.css'

export default {
    name: 'app',
    render() {
        return (
            <transition name="el-zoom-in-top">
                <router-view class="container"/>
            </transition>
        )
    }
}