<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="close"
  >
    <el-form
      ref="form"
      :inline="true"
      label-width="140px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="父级Id" prop="UpperId">
        <el-input v-model="form.UpperId" placeholder="父级菜单填写-1" />
      </el-form-item>
      <el-form-item label="名称" prop="Name">
        <el-input v-model="form.Name" />
      </el-form-item>
      <el-form-item label="路径" prop="Path">
        <el-input v-model="form.Path" />
      </el-form-item>
      <el-form-item label="vue文件路径" prop="Url">
        <el-input v-model="form.Url" />
      </el-form-item>
      <el-form-item label="标题" prop="MenuName">
        <el-input v-model="form.MenuName" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.Icon" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/menuManagement'

  export default {
    name: 'MenuManagementEdit',
    data() {
      return {
        form: {},
        rules: {
          UpperId: [
            { required: true, trigger: 'blur', message: '请输入父级id' },
          ],
          Name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          Path: [{ required: true, trigger: 'blur', message: '请输入路径' }],
          Url: [
            { required: true, trigger: 'blur', message: '请输入vue文件路径' },
          ],
          MenuName: [
            { required: true, trigger: 'blur', message: '请输入标题' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    methods: {
      handleIcon(item) {
        this.form.meta.icon = item
      },
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = JSON.parse(JSON.stringify(Object.assign({}, row)))
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
