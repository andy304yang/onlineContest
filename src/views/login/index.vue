<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="login">
        <div class="title-container">
          <h2 class="title">在线竞赛支撑平台</h2>
        </div>
        <!-- 账号 -->
        <el-form-item class="login_input" prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-tooltip v-model="capsTooltip" class="login_input" content="Caps lock is On" placement="right" manual>
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
              tabindex="2"
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
        <el-button
          class="login_input"
          :loading="loading"
          type="primary"
          style="width:70%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
        <div class="login-bottom">
          <div class="remember">
            <el-checkbox v-model="loginForm.isRemember" true-label="1" false-label="0"><span class="Checkbox">一周内免登录</span></el-checkbox>
          </div>
          <div class="forget">
            <el-popover
              trigger="hover"
              content="请联系管理员：邮箱15019993008@163.com"
            >
              <span slot="reference" style="color: black;">忘记密码？</span>
            </el-popover>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的账号！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位数！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        isRemember: 0
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      isRemember: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    const remUser = Cookies.get('content-user')
    const remPsw = Cookies.get('content-psw')
    if (remUser && remPsw) {
      this.loginForm.username = remUser
      this.loginForm.password = remPsw
      this.isRemember = true
    }
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 明文显示密码切换
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
    handleLogin() {
      // validate 是做一个登录的前端校验
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: '/', query: this.otherQuery })
              this.loading = false
              // isRemember表示是否勾选记住密码
              if (this.loginForm.isRemember) {
                Cookies.set('content-user', this.loginForm.username)
                Cookies.set('content-psw', this.loginForm.password)
              } else {
                Cookies.remove('content-user')
                Cookies.remove('content-psw')
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$notify.error({
            title: '失败！',
            message: '请检查您的输入是否规范!',
            duration: 2000
          })
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#A5A5A1;
$light_gray:#fff;
$cursor: #1E1E1E;

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
      color: black;
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
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    color: #454545;
  }
  .login_input{
    width: 70%;
    margin-left: 15%;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: url('../../img/bg.jpg');
  background-repeat: no-repeat;
  background-size:cover;
  overflow: hidden;

  .login-bottom{
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    justify-content: space-between;
    .remember{
      margin-bottom: 5px;
      /deep/ .el-checkbox__label{
        // color: $dark_gray;
        color: $light_gray;
      }
    }
    .forget{
      // color: #1890FF
      color: #fff;
    }
  }
  .login {
    background-color: hsla(0, 0%, 100%, .9);
    border-radius: 10px;
    box-shadow: 0 3px 10px #b4b3b3;
  }

  .login:hover {
    box-shadow: 0 3px 10px #fcfcfc
  }
  .Checkbox{
    color: black;
  }
  .login-form {
    position: relative;
    width: 630px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
      color: black;
      margin: 0px auto 40px auto;
      padding-top:50px;
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
