<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色码" prop="RoleName">
        <el-input v-model="form.RoleName" />
      </el-form-item>
      <el-form-item label="备注" prop="Comments">
        <el-input v-model="form.Comments" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/roleManagement'

  export default {
    name: 'RoleManagementEdit',
    data() {
      return {
        form: {
          btnRolesCheckedList: [],
        },
        rules: {
          RoleName: [
            { required: true, trigger: 'blur', message: '请输入角色码' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        list: [],
        /* btnRoles demo */
        btnRoles: [
          {
            lable: '读',
            value: 'read:system',
          },
          {
            lable: '写',
            value: 'write:system',
          },
          {
            lable: '删',
            value: 'delete:system',
          },
        ],
      }
    },
    created() {},
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
        // 具体业务请自行调整
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit({
              ...this.form,
            })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-tree-border {
    height: 200px;
    padding: $base-padding;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: $base-border-radius;
  }
</style>
