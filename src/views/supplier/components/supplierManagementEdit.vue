<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" label-width="90px" :model="form" :rules="rules">
      <el-form-item label="供应商编码" prop="Code">
        <el-input v-model.trim="form.Code" />
      </el-form-item>
      <el-form-item label="供应商名称" prop="Name">
        <el-input v-model.trim="form.Name" />
      </el-form-item>
      <el-form-item label="联系人" prop="LinkUser">
        <el-input v-model.trim="form.LinkUser" />
      </el-form-item>
      <el-form-item label="联系电话" prop="LinkPhone">
        <el-input v-model.trim="form.LinkPhone" />
      </el-form-item>
      <el-form-item label="联系地址" prop="LinkAddress">
        <el-input v-model.trim="form.LinkAddress" />
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
  import { doEdit } from '@/api/supplierManagement'

  export default {
    name: 'SupplierManagementEdit',
    data() {
      return {
        form: {
          roles: [],
        },
        rules: {
          Code: [
            { required: true, trigger: 'blur', message: '请输入供应商编码' },
          ],
          Name: [
            { required: true, trigger: 'blur', message: '请输入供应商名称' },
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
