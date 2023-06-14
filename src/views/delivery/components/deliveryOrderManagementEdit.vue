<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="80vw"
    @close="close"
    @size-change="handleSizeChange"
  >
    <el-form ref="form" inline label-width="80px" :model="form" :rules="rules">
      <el-form-item disabled="" label="单据编号" prop="Code">
        <el-input
          v-model.trim="form.Code"
          disabled
          placeholder="出库单号自动生成"
        />
      </el-form-item>
      <el-form-item label="出库口" prop="OutLocationCode">
        <el-select v-model="form.OutLocationCode" placeholder="请选择">
          <el-option
            v-for="dict in ckLocationCodeList"
            :key="dict.UserCode"
            :label="dict.Name"
            :value="dict.UserCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单据类型" prop="WaveType">
        <el-select v-model="form.WaveType" clearable placeholder="请选择">
          <el-option
            v-for="item in documentTypeOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户" prop="TradingCompany">
        <el-select v-model="form.TradingCompany" placeholder="请选择">
          <el-option
            v-for="dict in TradingCompanys"
            :key="dict.Code"
            :label="dict.Name"
            :value="dict.Name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
    <el-table border :data="childrenList">
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物料编码" prop="materialsCode" />
      <el-table-column align="center" label="物料名称" prop="materialsName" />
      <el-table-column align="center" label="出库数量 " prop="number" />
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="150"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
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
      title="新建发货单明细"
      :visible.sync="innerVisible.innerAddVisible"
      width="50%"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="addForm"
        :rules="addRules"
      >
        <el-form-item label="物料信息：" prop="materialsName">
          <el-autocomplete
            v-model="addForm.materialsName"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            value-key="materialsName"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="物料编码：" prop="materialsCode">
          <el-autocomplete
            v-model="addForm.materialsCode"
            class="inline-input"
            disabled
          />
        </el-form-item>
        <el-form-item label="单位：" prop="SmallestUnit">
          <el-autocomplete
            v-model="addForm.SmallestUnit"
            class="inline-input"
            disabled
          />
        </el-form-item>
        <el-form-item label="批次号：" prop="batchNo">
          <el-input
            v-model="addForm.batchNo"
            class="inline-input"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="收货数量：" prop="number">
          <el-input-number
            v-model.trim="addForm.number"
            controls-position="right"
            :max="1000"
            :min="1"
          />
        </el-form-item>
        <el-form-item label="入库时间：" prop="inTime">
          <el-input
            v-model.trim="addForm.inTime"
            class="inline-input"
            disabled
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="收货时间：" prop="inTime">
          <el-input
            v-model.trim="addForm.recivedTime"
            class="inline-input"
            disabled
            style="width: 180px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveChildren">保存</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  const dayjs = require('dayjs')
  import { mapGetters } from 'vuex'
  import {
    getLikeMaterialsList,
    Add0rUpdateAPI,
    getckLocationCodeListApi,
    getTradingCompanysApi,
  } from '@/api/deliveryOrderManagement'

  export default {
    name: 'DeliveryOrderManagementEdit',
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
          Code: '',
          Destination: '',
          WaveType: '',
          TradingCompany: '',
          items: [],
        },
        TradingCompanys: [],
        documentTypeOptions: [{ label: '普通出库', value: 'PTCK' }],
        addForm: {
          materialsName: '',
          materialsCode: '',
          batchNo: '',
          number: '',
          inTime: '',
          recivedTime: '',
        },
        addRules: {
          materialsName: [
            { required: true, trigger: 'change', message: '请选择物料名称' },
          ],
          number: [{ required: true, trigger: 'blur', message: '请输入数量' }],
        },
        rules: {
          Destination: [
            { required: true, trigger: 'blur', message: '请选择货主' },
          ],
          WaveType: [{ required: true, trigger: 'blur', message: '单据类型' }],
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
      this.getTradingCompanys()
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
      saveChildren() {
        this.$refs['addForm'].validate(async (valid) => {
          if (valid) {
            let id = this.id++
            this.childrenList.push({ ...this.addForm, id })
            this.innerVisible.innerAddVisible = false
          }
        })
      },
      handleSizeChange() {},
      addReceipt() {
        this.addForm = {
          materialsCode: '',
          number: '',
        }
        this.loadAll()
        this.innerVisible.innerAddVisible = true
      },
      showEdit(row) {
        if (!row) {
          this.title = '添加'
          this.form = {
            Id: '',
            CreatedBy: '',
            TrusteeBy: '',
            Code: '',
            Destination: '',
            WaveType: '',
            TradingCompany: '',
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
          Code: '',
          Destination: '',
          WaveType: '',
          TradingCompany: '',
          items: [],
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.form.CreatedBy = this.username
            this.form.items = [...this.childrenList]
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
        let time = dayjs().format('YYYY-M-D HH:mm:ss')
        assignObj.inTime = time
        assignObj.recivedTime = time
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
      async getTradingCompanys() {
        const res = await getTradingCompanysApi()
        if (res.code == 200) {
          this.TradingCompanys = res.data.list
        } else {
          this.TradingCompanys = []
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
