<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div class="unitLoads-management-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="70px"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item label="物料编码">
            <el-input
              v-model="queryForm.MaterialCode"
              clearable
              placeholder="请输入物料编码"
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              v-model="queryForm.ContainerCodeToMatch"
              clearable
              placeholder="请输入物料名称"
            />
          </el-form-item>
          <el-form-item label="批次号">
            <el-input
              v-model="queryForm.BatchNo"
              clearable
              placeholder="请输入批次号"
            />
          </el-form-item>
          <el-form-item label="生产日期">
            <el-input
              v-model="queryForm.ProduceDate"
              clearable
              placeholder="请输入生产日期"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="托盘号">
            <el-input
              v-model="queryForm.ContainerCode"
              clearable
              placeholder="请输入托盘号"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="入库时间">
            <el-date-picker
              v-model="queryForm.CreateAt"
              clearable
              placeholder="入库时间"
              type="datetime"
            />
            <span>　至　</span>
            <el-date-picker
              v-model="queryForm.EndAt"
              clearable
              placeholder="入库时间"
              type="datetime"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="物料类别" prop="MaterialType">
            <el-select
              v-model="queryForm.MaterialType"
              clearable
              placeholder="选择物料类别"
            >
              <el-option
                v-for="dict in materialsTypeList"
                :key="dict.Code"
                :label="dict.Name"
                :value="dict.Name"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="!fold" label="位置">
            <el-input
              v-model="queryForm.CurrentLocationToMatch"
              clearable
              placeholder="请输入位置"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="queryData"
            >
              查询
            </el-button>
            <!-- <el-form-item>
              <el-button type="primary" @click="handleDownload">
                导出 Excel
              </el-button>
            </el-form-item> -->
            <el-button type="text" @click="handleFold">
              <span v-if="fold">展开</span>
              <span v-else>合并</span>
              <vab-icon
                class="vab-dropdown"
                :class="{ 'vab-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :data="list">
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column
        align="center"
        label="入库时间"
        prop="CreatedAt"
        width="160"
      />
      <el-table-column
        align="center"
        label="当前位置"
        prop="CurrentLocation"
        width="150"
      />
      <el-table-column
        align="center"
        label="容器编码 "
        prop="ContainerCode"
        width="110"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="托盘类型"
        prop="type"
        width="110"
      />
      <el-table-column
        align="center"
        label="物料编码"
        prop="MaterialCode"
        width="160"
      />
      <el-table-column
        align="center"
        label="物料名称"
        prop="MaterialName"
        width="160"
      />
      <el-table-column align="center" label="数量" prop="Number" />
      <el-table-column align="center" label="批次" prop="BatchNo" width="150" />
      <el-table-column
        align="center"
        label="批次是否锁定"
        prop="CKMC"
        width="150"
      />
      <el-table-column
        align="center"
        label="生产日期"
        prop="ProduceDate"
        width="150"
      />

      <el-table-column
        v-if="false"
        align="center"
        label="单包重量"
        prop="SingleWeight"
        width="150"
      />

      <el-table-column
        v-if="false"
        align="center"
        label="有效期"
        prop="EffectiveDate"
        width="150"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="尺寸"
        prop="ChiCun"
        width="150"
      />

      <el-table-column
        align="center"
        label="物料类型"
        prop="Type"
        width="150"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="判定区分"
        prop="QCStatus"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="货位类型"
        prop="CKMC"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="任务锁"
        prop="IsSealed"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="货载锁"
        prop="IsLocked"
      />
      <el-table-column
        align="center"
        fixed
        label="操作"
        show-overflow-tooltip
        width="150"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleUpdate(row)">批次锁定</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="require('@/assets/empty_images/data_empty.png')"
        />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import {
    updateBatchNo,
    getExcelList,
    getList,
    getMaterialsTypeOptionApi,
  } from '@/api/unitLoadsManagement'
  import Edit from './components/tasksManagementEdit'

  export default {
    name: 'UnitLoadsManagement',
    components: { Edit },
    data() {
      return {
        list: [],
        materialsTypeList: [],
        fold: true,
        height: this.$baseTableHeight(3) - 30,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        downloadLoading: false,
        filename: '实时库存表',
        autoWidth: true,
        bookType: 'xlsx',
        options: ['xlsx', 'csv', 'txt'],
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          materialsName: '',
        },
      }
    },
    created() {
      this.fetchData()
      this.getMaterialsTypeOptionMethod()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleFold() {
        this.fold = !this.fold
        this.handleHeight()
      },
      handleHeight() {
        if (this.fold) this.height = this.$baseTableHeight(2) - 47
        else this.height = this.$baseTableHeight(3) - 30
      },
      handleEdit(row) {
        if (row.Id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleUpdate(row) {
        if (row.Id) {
          this.$baseConfirm('你确定要锁定当前批次吗', null, async () => {
            const { msg } = await updateBatchNo({ ids: row.Id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.Id).join()
            this.$baseConfirm('你确定要锁定当前批次吗', null, async () => {
              const { msg } = await updateBatchNo({ ids })
              this.$baseMessage(msg, 'success', 'vab-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const {
          data: { list, total },
        } = await getList(this.queryForm)
        this.list = list
        this.total = total
        this.listLoading = false
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/utils/excel').then((excel) => {
          const filterVal = [
            'CreatedAt',
            'CurrentLocation',
            'MaterialCode',
            'MaterialName',
            'Number',
            'BatchNo',
            'ProduceDate',
            'Type',
          ]
          const tHeader = [
            '入库时间',
            '当前位置',
            '物料编码',
            '物料名称',
            '数量',
            '批次',
            '生产日期',
            '物料类型',
          ]
          let that = this
          getExcelList(this.queryForm).then((res) => {
            let list = res.data.list || []
            that.list = list || []
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: that.filename,
              autoWidth: that.autoWidth,
              bookType: that.bookType,
            })
            that.downloadLoading = false
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map((v) =>
          filterVal.map((j) => {
            return v[j]
          })
        )
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
