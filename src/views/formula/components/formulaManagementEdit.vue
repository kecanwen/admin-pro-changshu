<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="80vw"
    @close="close"
    @size-change="handleSizeChange"
  >
    <el-form ref="form" inline label-width="80px" :model="form" :rules="rules">
      <el-form-item disabled="" label="配方编号" prop="Code">
        <el-input
          v-model.trim="form.Code"
          disabled
          placeholder="配方编号自动生成"
        />
      </el-form-item>
      <el-form-item label="配方名称" prop="Name">
        <el-input v-model.trim="form.Name" placeholder="请输入配方名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
    <el-table border :data="childrenList">
      <el-table-column align="center" show-overflow-tooltip type="selection" />
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物料编码" prop="materialsCode" />
      <el-table-column align="center" label="物料名称" prop="materialsName" />
      <el-table-column align="center" label="配方序号 " prop="seq" />
      <el-table-column align="center" label="出库口 " prop="exitCode" />
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
      title="新建配方明细"
      :visible.sync="innerVisible.innerAddVisible"
      width="30%"
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
        <el-form-item label="配方序号：" prop="seq">
          <el-input-number
            v-model.trim="addForm.seq"
            controls-position="right"
            :max="10"
            :min="1"
          />
        </el-form-item>
        <el-form-item label="出库口：" prop="exitCode">
          <el-select v-model="addForm.exitCode" placeholder="请选择">
            <el-option
              v-for="dict in cargoOwnerOptions"
              :key="dict.Code"
              :label="dict.Name"
              :value="dict.Name"
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
    Add0rUpdateAPI,
    getLikeMaterialsList,
    DeleteSellOrderItems,
    getFormulaLocationCodeListApi,
  } from '@/api/formulaManagement'

  export default {
    name: 'FormulaEdit',
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
          UpdatedBy: '',
          Name: '',
          items: [],
        },
        cargoOwnerOptions: [],
        addForm: {
          materialsCode: '',
          seq: '',
        },
        addRules: {
          materialsName: [
            { required: true, trigger: 'blur', message: '请选择物料名称' },
          ],
          seq: [{ required: true, trigger: 'blur', message: '请输入配方序号' }],
          exitCode: [
            { required: true, trigger: 'blur', message: '请选择出库口' },
          ],
        },
        rules: {
          Name: [
            { required: true, trigger: 'blur', message: '请输入配方名称' },
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
      this.getFormulaLocationCode()
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
          seq: '',
          exitCode: '',
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
            UpdatedBy: '',
            Name: '',
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
          UpdatedBy: '',
          Name: '',
          items: [],
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.form.CreatedBy = this.username
            this.form.UpdatedBy = this.username
            this.form.items = [...this.childrenList]
            const { msg } = await Add0rUpdateAPI(this.form)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
      itemsDelete(row) {
        DeleteSellOrderItems({ id: row.Id })
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
        //let time = dayjs().format('YYYY-M-D HH:mm:ss')
        this.addForm = assignObj
      },
      async getFormulaLocationCode() {
        const res = await getFormulaLocationCodeListApi()
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
