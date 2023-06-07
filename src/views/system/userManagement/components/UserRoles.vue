<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="UserName">
        <el-input v-model.trim="form.UserName" disabled />
      </el-form-item>
      <el-form-item label="真实姓名" prop="RealName">
        <el-input v-model.trim="form.RealName" disabled />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.RoleId" clearable placeholder="请选择角色">
          <el-option
            v-for="item in options"
            :key="item.Id"
            :label="item.RoleName"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getList, setRole } from '@/api/roleManagement'
  export default {
    name: 'UserRoles',
    data() {
      return {
        form: {
          roles: [],
        },
        rules: {
          UserName: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          RealName: [
            { required: true, trigger: 'blur', message: '请输入真实姓名' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        options: [],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        let para = { pageNo: 1, pageSize: 99 }
        const {
          data: { list },
        } = await getList(para)
        this.options = list
      },
      showEdit(row) {
        this.title = '设置角色'
        this.form = Object.assign({}, row)
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
            let para = { roleId: this.form.RoleId, userId: this.form.Id }
            debugger
            const { msg } = await setRole(para)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
