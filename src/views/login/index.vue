<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">兜礼后台管理系统登录</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          maxlength="40"
          placeholder="请输入用户邮箱"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          maxlength="20"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { Validate } from "@/common";
  import { encryption } from "@/common/jsencrypt.js";

  export default {
    name: "Login",
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码不能小于6位"));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          username: "",
          password: ""
        },
        loginRules: {
          username: [
            {
              required: true,
              trigger: "blur",
              validator: Validate.validateEmail
            }
          ],
          password: [
            {
              required: true,
              trigger: "blur",
              validator: validatePass
            }
          ]
        },
        loading: false,
        pwdType: "password",
        redirect: undefined
      };
    },
    methods: {
      showPwd() {
        if (this.pwdType === "password") {
          this.pwdType = "";
        } else {
          this.pwdType = "password";
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            const { username, password } = this.loginForm;
            this.loading = true;
            this.$store
              .dispatch("Login", {
                username: username,
                password: encryption(password)
              })
              .then(res => {
                this.loading = false;
                this.$router.push({
                  path: this.redirect || "/"
                });
              })
              .catch(err => {
                this.loading = false;
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    }
  };
</script>

<style lang="less" scoped>
  @bg: #2d3a4b;
  @light_gray: #eee;
  @dark_gray: #889aa4;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      /deep/ .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: @light_gray;
        height: 47px;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px @bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

  /* login page style */
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: @bg;

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
      .select{
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: @dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title {
      font-size: 26px;
      font-weight: 400;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: @dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>