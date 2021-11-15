import "./normal.css";

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