import "./normal.css";
export default {
    render() {
        return (
            <transition name="el-zoom-in-top">
                <router-view class="container"/>
            </transition>
        )
    }
}