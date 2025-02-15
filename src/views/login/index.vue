<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="form"
          class="login-form"
          label-position="left"
          :model="form"
          :rules="rules"
        >
          <div class="title">hello !</div>
          <div class="title-tips">
            {{ translateTitle('欢迎来到') }}{{ title }}！
          </div>
          <el-form-item prop="username" style="margin-top: 40px">
            <el-input
              v-model.trim="form.username"
              v-focus
              :placeholder="translateTitle('请输入用户名')"
              tabindex="1"
              type="text"
            >
              <template #prefix>
                <vab-icon icon="user-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :placeholder="translateTitle('请输入密码')"
              tabindex="2"
              :type="passwordType"
              @keyup.enter.native="handleLogin"
            >
              <template #prefix>
                <vab-icon icon="lock-line" />
              </template>
              <template v-if="passwordType === 'password'" #suffix>
                <vab-icon
                  class="show-password"
                  icon="eye-off-line"
                  @click="handlePassword"
                />
              </template>
              <template v-else #suffix>
                <vab-icon
                  class="show-password"
                  icon="eye-line"
                  @click="handlePassword"
                />
              </template>
            </el-input>
          </el-form-item>
          <!-- 验证码验证逻辑需自行开发，如不需要验证码功能建议注释 -->
          <!-- <el-form-item prop="verificationCode">
            <el-input
              v-model.trim="form.verificationCode"
              :placeholder="translateTitle('验证码') + previewText"
              tabindex="3"
              type="text"
            >
              <template #prefix>
                <vab-icon icon="barcode-box-line" />
              </template>
            </el-input>
            <el-image class="code" :src="codeUrl" @click="changeCode" />
          </el-form-item> -->
          <el-button
            class="login-btn"
            :loading="loading"
            style="margin-bottom: 10px"
            type="primary"
            @click="handleLogin"
          >
            {{ translateTitle('登录') }}
          </el-button>
          <!-- <router-link to="/register">
            <span>{{ translateTitle('注册') }}</span>
          </router-link> -->
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { translateTitle } from '@/utils/i18n'
  import { isPassword } from '@/utils/validate'

  export default {
    name: 'Login',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if ('' === value)
          callback(new Error(this.translateTitle('用户名不能为空')))
        else callback()
      }
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value))
          callback(new Error(this.translateTitle('密码不能少于6位')))
        else callback()
      }
      return {
        form: {
          username: '',
          password: '',
          //verificationCode: '',
        },
        rules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
          /* verificationCode: [
            {
              required: true,
              trigger: 'blur',
              message: '验证码不能空',
            },
          ], */
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        timer: 0,
        codeUrl: 'https://www.oschina.net/action/user/captcha',
        previewText: '',
      }
    },
    computed: {
      ...mapGetters({
        title: 'settings/title',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    mounted() {
      this.form.username = 'admin'
      this.form.password = '1234567890'
    },
    methods: {
      ...mapActions({
        login: 'user/login',
      }),
      translateTitle,
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleRoute() {
        return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
      },
      handleLogin() {
        this.$refs.form.validate(async (valid) => {
          if (valid)
            try {
              this.loading = true
              await this.login(this.form).catch(() => {})
              await this.$router.push(this.handleRoute())
            } finally {
              this.loading = false
            }
        })
      },
      changeCode() {
        this.codeUrl = `https://www.oschina.net/action/user/captcha?timestamp=${new Date().getTime()}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url('~@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;
  }

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 4.5vh;
    margin: calc((100vh - 475px) / 2) 5vw 5vw;
    overflow: hidden;
    background: url('~@/assets/login_images/login_form.png');
    background-size: 100% 100%;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: $base-color-white;
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: $base-color-white;
    }

    .login-btn {
      display: inherit;
      width: 220px;
      height: 50px;
      margin-top: 5px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }

      .forget-passwordword {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-password {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    i {
      position: absolute;
      top: 8px;
      left: 5px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      right: 25px;
      left: -35px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    :deep() {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 48px;
          padding-left: 35px;
          font-size: $base-font-size-default;
          line-height: 58px;
          background: #f6f4fc;
          border: 0;
        }
      }

      .code {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        border-radius: $base-border-radius;
      }
    }
  }
</style>
