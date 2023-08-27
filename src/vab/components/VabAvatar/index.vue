<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="avatar" />
      <div class="user-name">
        <span class="hidden-xs-only">{{ username }}</span>
        <vab-icon
          class="vab-dropdown"
          :class="{ 'vab-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <vab-icon icon="user-line" />
          {{ translateTitle('个人中心') }}
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <vab-icon icon="logout-circle-r-line" />
          {{ translateTitle('退出登录') }}
        </el-dropdown-item>
        <el-dropdown-item command="fixup">
          <i class="el-icon-edit"></i>
          {{ translateTitle('修改密码') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
    <el-dialog
      append-to-body
      :before-close="handleClose"
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        ref="registerForm"
        class="register-form"
        :model="form"
        :rules="registerRules"
        size="mini"
      >
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
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dropdown>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { toLoginRoute } from '@/utils/routes'
  import { fixupPassword } from '@/api/user'
  import { isPassword } from '@/utils/validate'

  export default {
    name: 'VabAvatar',
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
        active: false,
        dialogVisible: false,
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
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
    },
    methods: {
      translateTitle,
      ...mapActions({
        _logout: 'user/logout',
      }),
      handleClose() {},
      handleRegister() {
        this.$refs['registerForm'].validate(async (valid) => {
          if (valid) {
            const { msg } = await fixupPassword(this.form)
            this.$message.info(msg)
          }
        })
      },
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'personalCenter':
            this.personalCenter()
            break
          case 'fixup':
            this.dialogVisible = true
            break
        }
      },
      handleVisibleChange(val) {
        this.active = val
      },
      personalCenter() {
        this.$router.push('/setting/personalCenter')
      },
      async logout() {
        await this._logout()
        await this.$router.push(toLoginRoute(this.$route.fullPath))
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
