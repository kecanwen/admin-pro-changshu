<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="编码" prop="UserCode">
        <el-input v-model.trim="form.UserCode" />
      </el-form-item>
      <el-form-item label="名称" prop="Name">
        <el-input v-model.trim="form.Name" />
      </el-form-item>
      <el-form-item label="模式" prop="OutModel">
        <el-select v-model="form.OutModel" placeholder="请选择">
          <el-option
            v-for="item in OutModel"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="请求类型" prop="RequestType">
        <el-select v-model="form.RequestType" placeholder="请选择">
          <el-option
            v-for="item in RequestType"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
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
  import { doEdit } from '@/api/plainLocationsManagement'

  export default {
    name: 'PlainLocationsManagementEdit',
    data() {
      return {
        RequestType: [{ label: '普通入库', value: 'PTRK' }],
        OutModel: [
          { label: '入库', value: 'RK' },
          { label: '出库', value: 'CK' },
        ],
        form: {
          warehouse: [],
        },
        rules: {
          UserCode: [
            { required: true, trigger: 'blur', message: '请输入编码' },
          ],
          Name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          OutModel: [
            { required: true, trigger: 'blur', message: '请选择模式' },
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
