<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="80vw"
    @close="close"
    @size-change="handleSizeChange"
  >
    <el-form ref="form" inline label-width="80px" :model="form">
      <el-form-item label="配方名称" prop="Name">
        <el-input v-model.trim="form.Name" placeholder="请输入配方名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
    <el-table
      ref="tableRef"
      border
      :data="childrenList"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="库位 " prop="CurrentLocation" />
      <el-table-column align="center" label="托盘号 " prop="ContainerCode" />
      <el-table-column align="center" label="物料代码" prop="MaterialCode" />
      <el-table-column align="center" label="批号" prop="BatchNo" />
      <el-table-column align="center" label="生产日期" prop="ProduceDate" />
      <el-table-column align="center" label="数量 " prop="Number" />
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="require('@/assets/empty_images/data_empty.png')"
        />
      </template>
    </el-table>
    <el-row class="moreOperation" style="margin-top: 20px">
      <el-col :span="24">
        <el-button type="primary" @click="addReceipt">新建</el-button>
      </el-col>
    </el-row>
    <el-dialog
      append-to-body
      title="新建出库配方明细"
      :visible.sync="innerVisible.innerAddVisible"
      width="30%"
    >
      <el-form
        ref="addForm"
        label-width="140px"
        :model="addForm"
        :rules="addRules"
      >
        <el-form-item label="配方" prop="SellOrderCode">
          <el-select v-model="addForm.SellOrderCode" placeholder="请选择配方">
            <el-option
              v-for="dict in ckLocationCodeList"
              :key="dict.UserCode"
              :label="dict.Name"
              :value="dict.UserCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveChildren">保存</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    getLikeMaterialsList,
    Add0rUpdateAPI,
    getckLocationCodeListApi,
    GetUnitLoadListApi,
  } from '@/api/formulaOutManagement'

  export default {
    name: 'FormulaOutManagementEdit',
    data() {
      return {
        queryString: '',
        id: 1,
        restaurantList: [],
        ckLocationCodeList: [],
        childrenList: [],
        innerVisible: {
          innerAddVisible: false,
          innerStorageVisible: false,
          innerImportVisible: false,
          innerBatchVisible: false,
        },
        form: {
          Id: '',
          CreatedBy: '',
          TrusteeBy: '',
          items: [],
        },
        addForm: {},
        addRules: {
          SellOrderCode: [
            { required: true, trigger: 'change', message: '请选择配方' },
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
      selectionChange(selection) {
        this.form.items = selection
      },
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
      saveChildren() {
        this.$refs['addForm'].validate(async (valid) => {
          if (valid) {
            this.GetUnitLoadListMethod()
          }
        })
      },
      handleSizeChange() {},
      addReceipt() {
        this.addForm = {
          SellOrderCode: '',
        }
        this.innerVisible.innerAddVisible = true
      },
      showEdit(row) {
        if (!row) {
          this.title = '添加'
          this.form = {
            Id: '',
            CreatedBy: '',
            TrusteeBy: '',
            items: [],
          }
          this.childrenList = []
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          this.childrenList = row.items
          console.log(row, 'row')
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = {
          Id: '',
          CreatedBy: '',
          TrusteeBy: '',
          items: [],
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.form.CreatedBy = this.username
            const { msg } = await Add0rUpdateAPI(this.form)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
      handleDelete(row) {
        this.childrenList = this.childrenList.filter(
          (item) => item.id !== row.id
        )
      },
      async querySearch(queryString, cb) {
        let restaurants = this.restaurantList
        let results = []
        if (queryString) {
          const { data } = await getLikeMaterialsList({
            materialsStr: queryString,
          })
          results = data.list || []
        } else {
          results = restaurants
        }
        cb(results)
      },
      handleSelect(row) {
        let assignObj = Object.assign(this.addForm, { ...row })
        this.addForm = assignObj
      },
      async getrkLocationCodeList() {
        const res = await getckLocationCodeListApi()
        if (res.code == 200) {
          this.ckLocationCodeList = res.data.list
        } else {
          this.ckLocationCodeList = []
        }
      },
      async GetUnitLoadListMethod() {
        if (this.addForm.number > this.addForm.SumNumber) {
          this.$message.error('出库数量不能大于库存总数!')
          return
        }
        const res = await GetUnitLoadListApi(this.addForm)
        if (res.code === 200) {
          this.childrenList = res.data.list
        } else {
          this.childrenList = []
        }
        this.innerVisible.innerAddVisible = false
        this.$refs['tableRef'].toggleAllSelection()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .moreOperation {
    margin-top: 20px;
  }
</style>
