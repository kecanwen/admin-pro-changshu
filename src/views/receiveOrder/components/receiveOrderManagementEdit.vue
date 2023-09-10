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
          placeholder="入库单号自动生成"
        />
      </el-form-item>
      <el-form-item label="托盘号" prop="PalletNo">
        <el-input v-model.trim="form.PalletNo" placeholder="请输入托盘号" />
      </el-form-item>
      <el-form-item label="单据类型" prop="ReceiveType">
        <el-select v-model="form.ReceiveType" placeholder="请选择">
          <el-option
            v-for="item in documentTypeOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库口" prop="LocationCode">
        <el-select v-model="form.LocationCode" placeholder="请选择">
          <el-option
            v-for="item in locationCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
    <el-table border :data="childrenList">
      <el-table-column align="center" show-overflow-tooltip type="selection" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物料编码" prop="materialsCode" />
      <el-table-column align="center" label="物料名称" prop="materialsName" />
      <el-table-column align="center" label="收货数量 " prop="number" />
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="150"
      >
        <template #default="{ row }">
          <el-button type="text" @click="itemsDelete(row)">删除</el-button>
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
      title="新建收货单明细"
      :visible.sync="innerVisible.innerAddVisible"
      width="60%"
    >
      <el-form
        ref="addForm"
        :inline="true"
        label-width="140px"
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
          <el-input v-model="addForm.batchNo" class="inline-input" />
        </el-form-item>
        <el-form-item label="单包重量：" prop="singleWeight">
          <el-input v-model="addForm.singleWeight" class="inline-input" />
        </el-form-item>
        <el-form-item label="生产日期：" prop="produceDate">
          <el-input v-model="addForm.produceDate" class="inline-input" />
        </el-form-item>
        <el-form-item label="有效期：" prop="validityDate">
          <el-input v-model="addForm.validityDate" class="inline-input" />
        </el-form-item>
        <el-form-item label="尺寸：" prop="size">
          <el-input v-model="addForm.size" class="inline-input" />
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
          />
        </el-form-item>
        <el-form-item label="收货时间：" prop="inTime">
          <el-input
            v-model.trim="addForm.recivedTime"
            class="inline-input"
            disabled
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
    Add0rUpdateAPI,
    getLikeMaterialsList,
    getCargoOwnerOptionsApi,
  } from '@/api/receiveOrderManagement'

  export default {
    name: 'GroundingEdit',
    data() {
      return {
        queryString: '',
        restaurantList: [],
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
          ReceiveType: '',
          Supplier: '',
          items: [],
        },
        cargoOwnerOptions: [],
        documentTypeOptions: [
          { label: '普通入库', value: 'YLRK' },
          { label: '空托盘入库', value: 'KTPRK' },
        ],
        locationCodeOptions: [
          { label: '物流口D', value: '00-001-1003' },
          { label: '物流口F1', value: '00-001-1004' },
        ],
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
            { required: true, trigger: 'blur', message: '请选择物料名称' },
          ],
          number: [{ required: true, trigger: 'blur', message: '请输入数量' }],
        },
        rules: {
          PalletNo: [
            { required: true, trigger: 'blur', message: '请输入托盘号' },
          ],
          ReceiveType: [
            { required: true, trigger: 'blur', message: '请选择单据类型' },
          ],
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
      this.getCargoOwnerOptions()
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
            this.childrenList.push({ ...this.addForm })
            this.innerVisible.innerAddVisible = false
          }
        })
      },
      handleSizeChange() {},
      addReceipt() {
        this.addForm = {
          materialsCode: '',
          materialsName: '',
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
            ReceiveType: '',
            Supplier: '',
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
          ReceiveType: '',
          Supplier: '',
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
      itemsDelete(row) {
        this.childrenList = this.childrenList.filter((item) => {
          return item.Id !== row.Id
        })
        this.$emit('fetch-data')
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
      async getCargoOwnerOptions() {
        const res = await getCargoOwnerOptionsApi()
        if (res.code == 200) {
          this.cargoOwnerOptions = res.data.list
        } else {
          this.cargoOwnerOptions = []
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
