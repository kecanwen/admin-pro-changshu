<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="名称" prop="Name">
        <el-input v-model.trim="form.Name" />
      </el-form-item>
      <el-form-item label="类型" prop="Type">
        <el-select
          v-model="form.Type"
          clearable
          placeholder="选择类型"
          style="width: 380px"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="值" prop="Value">
        <el-input v-model.trim="form.Value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/wmsSettings'

  export default {
    name: 'WmsSettingsEdit',
    data() {
      return {
        form: {
          roles: [],
        },
        rules: {
          Name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          Value: [{ required: true, trigger: 'blur', message: '请输入值' }],
          Type: [{ required: true, trigger: 'blur', message: '请选择类型' }],
        },
        title: '',
        dialogFormVisible: false,
        typeList: [
          { label: '字符', value: '字符' },
          { label: '整数', value: '整数' },
        ],
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
