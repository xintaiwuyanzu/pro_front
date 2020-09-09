<template>
  <div class="show">
    <div class="center">
      <div class="left">
        <img src="../assets/bg2.png"/>
      </div>
      <div class="right">
        <img style="margin-top: 43px" src="../assets/drlogo.png"/>
        <div class="form">
          <el-form>
            <el-form-item>
              <el-input style=" margin-top:43px;width: 300px" type="text"
                        placeholder="请输入用户名" v-model="form.username" :disabled="loginLoading"
                        autofocus @keyup.enter.native="keyEnterSerch">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input style="margin-top:13px;width: 300px;" placeholder="请输入密码" ref="psw"
                        v-model="form.password" type="password" :disabled="loginLoading"
                        @keyup.enter.native="doLogin(form)">
              </el-input>
            </el-form-item>
            <div style="width: 300px;margin-top: 9px;text-align: right">
              <el-switch v-model="form.remberpwd" inactive-text="记住我？">
              </el-switch>
            </div>
            <img style=" margin-top:21px;width: 300px;"
                 @click="submitForm"/>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>·技术支持：山东达融信息技术有点公司·</span>
    </div>
  </div>
</template>
<script lang="jsx">
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        remberpwd: false
      }
    }
  },
  methods: {
    keyEnterSerch() {
      this.$refs.psw.focus()
    },
    //点击登录调用方法
    submitForm() {
      this.doLogin(this.form)
      //判断复选框是否被勾选 勾选则调用配置cookie方法
      if (this.form.remberpwd === true) {
        //传入账号名，密码，和保存天数 3个参数
        this.setCookie(this.form.username, this.form.password, 7);
      } else {
        this.clearCookie()
      }
    },
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date();//获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);//保存的天数
      //字符串拼接cookie
      window.document.cookie = "username" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie = "remberpwd" + "=" + true + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
        console.log(arr)
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=');//再次切割
          //判断查找相对应的值
          if (arr2[0] == 'username') {
            this.form.username = arr2[1];//保存到保存数据的地方
          } else if (arr2[0] == 'password') {
            this.form.password = arr2[1];
          } else if (arr2[0] == 'remberpwd') {
            this.form.remberpwd = true
          }
        }
      }
    },
    //清除cookie
    clearCookie() {
      this.setCookie("", "", -1);//修改2值都为空，天数为负1天就好了
    }
  },
  //页面加载调用获取cookie值
  mounted() {
    this.getCookie()
  }
}
</script>
<style lang="scss">
.show {
  background: url("../assets/pic.png") round;
  height: 100%;
  width: 100%;

  .center {
    background: url("../assets/bg.png") no-repeat;
    height: 533px;
    width: 840px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;

    .left {
      height: 402px;
      width: 452px;
      margin-left: 20px;
    }

    .right {
      margin-right: 55px;

      .form {
        height: 40vh;
        background-size: cover;

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

  .footer {
    height: 40px;
    width: 100%;
    margin: auto;
    position: absolute;
    top: revert;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
  }
}

.el-form-item--small.el-form-item {
  margin-bottom: 5px
}

.show .center .right .form .el-input__inner {
  height: 44px;
}
</style>
