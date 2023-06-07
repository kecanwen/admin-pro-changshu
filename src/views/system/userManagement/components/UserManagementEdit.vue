<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="UserName">
        <el-input v-model.trim="form.UserName" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="RealName">
        <el-input v-model.trim="form.RealName" />
      </el-form-item>
      <el-form-item label="密码" prop="Password">
        <el-input v-model.trim="form.Password" type="password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="Email">
        <el-input v-model.trim="form.Email" />
      </el-form-item>
      <el-form-item label="备注" prop="Comments">
        <el-input v-model.trim="form.Comments" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/userManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          roles: [],
        },
        rules: {
          UserName: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          Password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          RealName: [
            { required: true, trigger: 'blur', message: '请输入真实姓名' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
