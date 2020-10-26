<template>
  <el-tooltip content="退出登录" placement="bottom" effect="light">
    <el-button circle size="mini" @click="logout()">
      <icon icon="delete" style="width: 20px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import loginUtil from '../login/util'

export default {
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
