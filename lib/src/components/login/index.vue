<template>
  <div class="login">
    <div class="bg">
      <el-row>
        <el-col :span="16">
          <div class="bg-1">
          </div>
        </el-col>
        <el-col :span="8" style="margin-top: 12vh">
          <div class="form" @keyup.enter="doLogin(loginForm)">
            <el-form>
              <el-form-item>
                <span style="letter-spacing: 5px;font-size: 20px; font-weight: bold">{{ title }}</span>
              </el-form-item>
              <el-form-item>
                <el-input type="text"
                          placeholder="请输入用户名" v-model="loginForm.username" :disabled="loading"
                          autofocus>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入密码"
                          v-model="loginForm.password" type="password" :disabled="loading">
                </el-input>
              </el-form-item>
              <img src="./login.png" style="width:100%;height:auto;margin: auto;" @click="doLogin(loginForm)"/>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import AbstractLogin from "./AbstractLogin";

export default {
  extends: AbstractLogin
}
</script>
<style lang="scss">
.login {
  background: linear-gradient(128deg, #2f8af1, #1d71e1);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    max-width: 100vw;
    height: auto;
    background-size: cover;
  }

  .bg {
    background-image: url("./bg1.png");
    height: 70vh;
    width: 80vw;
    align-content: center;
    background-size: cover;

    .bg-1 {
      background-image: url("./bg2.png");
      height: 45vh;
      width: 30vw;
      margin-top: 10vh;
      margin-left: 5vw;
      background-size: cover;
    }

    .form {
      border-radius: 5px;
      background-color: white;
      padding: 18px;
      width: 255px;

      .el-input-group {
        margin-bottom: 2vh;
        margin-left: 13vw;
      }

      .el-input__inner {
        height: 5vh;
      }
    }
  }
}
</style>
