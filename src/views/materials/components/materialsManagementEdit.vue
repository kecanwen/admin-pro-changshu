<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="物料编码" prop="Code">
        <el-input v-model.trim="form.Code" />
      </el-form-item>
      <el-form-item label="物料名称" prop="Name">
        <el-input v-model.trim="form.Name" />
      </el-form-item>
      <el-form-item label="单位" prop="SmallestUnit">
        <el-input v-model.trim="form.SmallestUnit" />
      </el-form-item>
      <el-form-item label="物料类别" prop="Type">
        <el-select
          v-model="form.Type"
          clearable
          placeholder="选择物料类别"
          style="width: 380px"
        >
          <el-option
            v-for="dict in materialsTypeList"
            :key="dict.Code"
            :label="dict.Name"
            :value="dict.Name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单层数量" prop="ShortName">
        <el-input v-model.trim="form.ShortName" />
      </el-form-item>
      <el-form-item label="单层高度" prop="Barcode">
        <el-input v-model.trim="form.Barcode" />
      </el-form-item>
      <el-form-item label="单个重量" prop="SingleWeight">
        <el-input v-model.trim="form.SingleWeight" />
      </el-form-item>
      <el-form-item label="保质期预警" prop="Days">
        <el-input v-model.trim="form.Days" />
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
  import { doEdit, getMaterialsTypeOptionApi } from '@/api/materialsManagement'

  export default {
    name: 'MaterialsManagementEdit',
    data() {
      return {
        form: {
          roles: [],
        },
        rules: {
          Code: [
            { required: true, trigger: 'blur', message: '请输入物料编码' },
          ],
          Name: [
            { required: true, trigger: 'blur', message: '请输入物料名称' },
          ],
          SmallestUnit: [
            { required: true, trigger: 'blur', message: '请输入物料单位' },
          ],
          Type: [
            { required: true, trigger: 'blur', message: '请选择物料类别' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        materialsTypeList: [],
      }
    },
    created() {
      this.getMaterialsTypeOptionMethod()
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
      async save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
      async getMaterialsTypeOptionMethod() {
        const res = await getMaterialsTypeOptionApi()
        if (res.code == 200) {
          this.materialsTypeList = res.data.list
        } else {
          this.materialsTypeList = []
        }
      },
    },
  }
</script>
