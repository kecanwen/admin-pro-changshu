<template>
  <div class="register-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="registerForm"
          class="register-form"
          :model="form"
          :rules="registerRules"
          size="mini"
        >
          <div class="title-tips">{{ translateTitle('修改密码') }}</div>
          <el-form-item prop="password">
            <el-input
              v-model.trim="form.password"
              autocomplete="new-password"
              :placeholder="translateTitle('请输入新密码')"
              type="password"
            >
              <template #prefix>
                <vab-icon icon="lock-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password1">
            <el-input
              v-model.trim="form.password1"
              autocomplete="new-password"
              :placeholder="translateTitle('请确认密码')"
              type="password"
            >
              <template #prefix>
                <vab-icon icon="lock-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="register-btn"
              type="primary"
              @click.native.prevent="handleRegister"
            >
              {{ translateTitle('确认') }}
            </el-button>
            <router-link to="/login">
              <div style="margin-top: 20px">
                {{ translateTitle('登陆') }}
              </div>
            </router-link>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { isPassword } from '@/utils/validate'
  import { fixupPassword } from '@/api/user'
  import { mapActions } from 'vuex'

  export default {
    name: 'FixupPassword',
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
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error(this.translateTitle('密码不能少于6位')))
        } else {
          callback()
        }
      }
      const validatePassword1 = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error(this.translateTitle('密码不能少于6位')))
        } else if (this.form.password !== this.form.password1) {
          callback(new Error(this.translateTitle('两次输入密码不一致')))
        } else {
          callback()
        }
      }

      return {
        isGetPhone: false,
        timertimer: null,
        phoneCode: this.translateTitle('获取验证码'),
        showRegister: false,
        form: {},
        registerRules: {
          password: [
            {
              required: true,
              trigger: 'blur',
              message: this.translateTitle('请输入密码'),
            },
            { validator: validatePassword, trigger: 'blur' },
          ],
          password1: [
            {
              required: true,
              trigger: 'blur',
              message: this.translateTitle('请确认密码'),
            },
            { validator: validatePassword1, trigger: 'blur' },
          ],
        },
        loading: false,
        passwordType: 'password',
      }
    },
    beforeDestroy() {
      this.timertimer = null
      clearInterval(this.timertimer)
    },
    methods: {
      ...mapActions({
        setToken: 'user/setToken',
      }),
      translateTitle,
      handleRegister() {
        this.$refs['registerForm'].validate(async (valid) => {
          if (valid) {
            const { msg } = await fixupPassword(this.form)
            this.$message.info(msg)
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .register-container {
    height: 100vh;
    min-height: 700px;
    background: url('~@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;

    .register-form {
      position: relative;
      max-width: 100%;
      padding: 4.5vh;
      margin: calc((100vh - 590px) / 2) 5vw 5vw;
      overflow: hidden;
      background: url('~@/assets/login_images/login_form.png');
      background-size: 100% 100%;

      .title-tips {
        margin-top: 29px;
        font-size: 26px;
        font-weight: 400;
        color: $base-color-white;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .register-btn {
        display: inherit;
        width: 220px;
        height: 50px;
        margin-top: 5px;
        border: 0;

        &:hover {
          opacity: 0.9;
        }
      }

      .phone-code {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 120px;
        height: 32px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        user-select: none;
        border-radius: 3px;
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

    :deep() {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

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
    }
  }
</style>
