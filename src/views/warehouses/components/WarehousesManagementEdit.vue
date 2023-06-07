<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :warehouse="warehouse">
      <el-form-item label="仓库编码" prop="UserCode">
        <el-input v-model.trim="form.UserCode" />
      </el-form-item>
      <el-form-item label="仓库名称" prop="Name">
        <el-input v-model.trim="form.Name" />
      </el-form-item>
      <el-form-item label="仓库类型" prop="WarehouseType">
        <el-input v-model.trim="form.WarehouseType" />
      </el-form-item>
      <el-form-item label="说明" prop="Comments">
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
  import { doEdit } from '@/api/warehousesManagement'

  export default {
    name: 'WarehousesManagementEdit',
    data() {
      return {
        form: {
          warehouse: [],
        },
        warehouse: {
          UserCode: [
            { required: true, trigger: 'blur', message: '请输入仓库编码' },
          ],
          Name: [
            { required: true, trigger: 'blur', message: '请输入仓库名称' },
          ],
          WarehouseType: [
            { required: true, trigger: 'blur', message: '请选择仓库类型' },
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
