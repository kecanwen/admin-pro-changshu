<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="托盘码" prop="PalletNo">
        <el-input v-model.trim="form.PalletNo" disabled />
      </el-form-item>
      <el-form-item label="入库口" prop="LocationCode">
        <el-select
          v-model="form.LocationCode"
          clearable
          placeholder="选择入库口"
          style="width: 380px"
        >
          <el-option
            v-for="dict in rkLocationCodeList"
            :key="dict.UserCode"
            :label="dict.Name"
            :value="dict.UserCode"
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
  import { mapGetters } from 'vuex'
  import {
    GroundingAPI,
    getLikeMaterialsList,
    getrkLocationCodeListApi,
  } from '@/api/receiveOrderManagement'

  export default {
    name: 'GroundingEdit',
    data() {
      return {
        queryString: '',
        id: 1,
        restaurantList: [],
        rkLocationCodeList: [],
        childrenList: [],
        innerVisible: {
          innerAddVisible: false,
          innerStorageVisible: false,
          innerImportVisible: false,
          innerBatchVisible: false,
        },
        form: {
          Id: '',
          PalletNo: '',
          LocationCode: '',
        },
        rules: {
          LocationCode: [
            { required: true, trigger: 'blur', message: '请选择入库口' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        username: 'user/username',
      }),
    },
    created() {
      this.getrkLocationCodeList()
    },
    mounted() {},
    methods: {
      async loadAll(queryString = '') {
        const { data, code } = await getLikeMaterialsList({
          materialsStr: queryString,
        })
        if (code == 200) {
          this.restaurantList = data.list
        } else {
          this.restaurantList = []
        }
      },
      showEdit(row) {
        this.title = '上架'
        this.form = Object.assign({}, row)
        this.childrenList = row.items
        console.log(row, 'row')
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = {
          Id: '',
          PalletNo: '',
          LocationCode: '',
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            //this.form.CreatedBy = this.username
            const { msg } = await GroundingAPI(this.form)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
      async getrkLocationCodeList() {
        const res = await getrkLocationCodeListApi()
        if (res.code == 200) {
          this.rkLocationCodeList = res.data.list
        } else {
          this.rkLocationCodeList = []
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .moreOperation {
    margin-top: 20px;
  }
</style>
