<template>
  <section>
    <full-screen/>
    <el-tooltip content="退出登录" placement="bottom" effect="light">
      <el-button circle size="mini" @click="logout()">
        <icon icon="delete" style="width: 18px"/>
      </el-button>
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

export default {
  name: 'headerRight',
  components: {FullScreen},
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
