<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="creditCode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="creditCode"
          v-model="loginForm.creditCode"
          placeholder="税号"
          name="creditCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="账号"
          name="account"
          type="text"
          tabindex="2"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="3"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="authCode">
        <span class="svg-container">
          <svg-icon icon-class="qrcode" />
        </span>
        <el-input
          ref="authCode"
          v-model="oKeySms.smsCode"
          placeholder="验证码"
          name="authCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
        <!-- <span class="show-pwd" @click="imgSrc">
          <img :src="bImgSrc">
        </span> -->
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;" :disabled="!bDisabled" @click="sendSmsCode">发送验证码</el-button>
      <span style="margin-bottom:10px;" />
      <el-button :loading="loading" type="primary" style="width:100%;" :disabled="bDisabled" @click="handleLogin">登录</el-button>

      <!--<div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary">
          Or connect with
        </el-button>
      </div>-->
    </el-form>
  </div>
</template>

<script>
/* eslint-disable no-undef */

// import md5 from 'md5'
// import axios from 'axios'
// import hmacSHA256 from 'crypto-js/hmac-sha256'
// import Base64 from 'crypto-js/enc-base64'

export default {
  name: 'Login',
  components: {},
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      }
      if (value.length < 5) {
        callback(new Error('密码大于5位'))
      } else {
        callback()
      }
    }
    // const validateAuthCode = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入验证码'))
    //   }
    //   if (value !== this.sAuthCode) {
    //     callback(new Error('验证码不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        // smsCode: '',
        account: '13568985364',
        creditCode: '91510108MA61RFD77H',
        password: 'zy230609'
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入账号名称' }],
        creditCode: [{ required: true, trigger: 'blur', message: '请输入税号' }],
        // authCode: [{ required: true, trigger: 'blur', validator: validateAuthCode }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      sAuthCode: '',
      bImgSrc: '',
      redirect: undefined,
      otherQuery: {},

      oKeySms: {
        smsCode: '',
        smscode_id: ''
      }
    }
  },
  computed: {
    bDisabled() {
      return oKey.type === 1 && !this.oKeySms.smscode_id
    }
  },
  watch: {
  },
  created() {
    if (oKey.type === 2) {
      this.loginForm = {
        account: '18057179365',
        creditCode: '913301026680332757',
        password: 'Asd333275@'
      }
    }
    this.$store.dispatch('key/getPublicKey').then(() => {
      // this.handleLogin()
    })
  },
  mounted() {
    this.fFocus()
    // this.handleLogin()
  },
  destroyed() {
  },
  methods: {
    fFocus() {
      if (this.loginForm.account === '') {
        this.$refs.account.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      } else {
        // this.$refs.authCode.focus()
      }
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    sendSmsCode() {
      this.$store.dispatch('key/sendSmsCode', this.loginForm).then(res => {
        this.oKeySms = {
          smscode_id: res.smscode_id,
          uuid: res.uuid
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('key/login', oKey.type === 1 ? this.oKeySms : this.loginForm).then(() => {
            // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.$router.push('/')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          this.fFocus()
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg: #fff;
$light_gray:#999;
$cursor: #999;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: $bg;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#666;

.login-container {
  min-height: 100%;
  width: 100%;
  /*background-color: $bg;*/
  // background: url('../../assets/login/login_bg.png') no-repeat;
  /*background-position: 50%;*/
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 360px;
    max-width: 100%;
    padding: 100px 35px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 540px;
    margin: auto;
    overflow: hidden;
    border-radius: 6px;
    background-color: #eee;
    transition: all 0.3s;

    //&:hover{
    //  width: 380px;
    //  height: 570px;
    //  padding: 115px 45px;
    //}
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
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
