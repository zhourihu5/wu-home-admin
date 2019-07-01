<template>
  <div class="login">
    <div class="login-background"></div>
    <div class="content-box animated bounceInLeft">
      <div class="content">
        <i class="icon"></i>
        <p class="title">{{ $t('login.title')}}</p>
        <lang-select class="set-language"/>
      </div>
      <div class="login-box">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="right"
        >
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              :placeholder="$t('login.password')"
              name="password"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-lock"
              show-password
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-form>
        <el-button
          class="my-button"
          :loading="loading"
          :disabled="disabled"
          type="primary"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "~@/styles/mixin.scss";
.login {
  height: 100%;
  width: 100%;
  position: relative;
  .login-background {
    background: url("./../../assets/login/loginBackground.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    animation: mymove 1s ease-in;
    -webkit-animation: mymove 1s ease-in; /*Safari and Chrome*/
    -webkit-filter: blur(4px); /* Chrome, Opera */
    -moz-filter: blur(4px);
    -ms-filter: blur(4px);
    filter: blur(4px);
  }
  .content-box {
    position: absolute;
    top: 50%;
    left: 50%;
    // transform: translate(-50%, -50%);
    margin-top: -250px;
    margin-left: -250px;
    .content {
      @include clearfix;
      width: 65%;
      margin: 0 auto 43px auto;
      .set-language {
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        margin-right: 10px;
        cursor: pointer;
      }
      .icon {
        background: url("./../../assets/login/login-icon.png") no-repeat;
        width: 30px;
        height: 30px;
        float: left;
        margin-top: 5px;
        margin-right: 7px;
      }
      .title {
        font-size: 36px;
        color: #409eff;
        animation: mymove 1s ease-in;
        -webkit-animation: mymove 1s ease-in; /*Safari and Chrome*/
        margin: 0;
        text-align: center;
      }
    }
    .login-box {
      width: 500px;
      height: 308px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      text-align: center;
      .login-form {
        padding-top: 60px;
        width: 340px;
        margin: 0 auto;
        .el-form-item {
          margin-bottom: 39px;
          .el-input {
            height: 36px;
          }
        }
      }
      .my-button {
        width: 340px;
        height: 46px;
      }
      input {
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: #000 !important;
        }
      }
    }
  }
}
</style>
<script>
import LangSelect from "@/components/LangSelect";
import { generatePoint } from "@/utils/i18n";
export default {
  components: {
    LangSelect
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("login.nickName")
          }
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: this.generatePoint("login.password")
          }
        ]
      },
      loading: false,
      disabled: true
    };
  },
  watch: {
    loginForm: {
      handler: function(val, oldval) {
        if (val.username && val.password) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        // console.log(val);
      },
      deep: true //对象内部的属性监听，也叫深度监听
    }
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    generatePoint,
    handleLogin() {
      let _this = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
