<template>
  <section>
    <full-screen/>
    <theme-select/>
    <sys-select/>
    <el-tooltip content="退出登录" placement="bottom">
      <section @click="logout()" class="top_icon">
        <icon icon="delete"/>
      </section>
    </el-tooltip>
  </section>
</template>

<script>
/**
 * 右侧默认登出
 * TODO 将来可以添加消息通知和用户信息
 */
import loginUtil from '../login/util'
import FullScreen from "./fullScreen";
import ThemeSelect from "./themeSelect";
import SysSelect from "./sysSelect";

export default {
  name: 'headerRight',
  components: {SysSelect, ThemeSelect, FullScreen},
  methods: {
    logout() {
      this.$confirm("确定要退出登录吗？", '提 醒', {type: 'waring'})
          .then(() => {
            loginUtil.cleanToken()
            this.$message.success('退出登录成功！')
            this.$router.push('/login')
          })
    }
  }
}
</script>
