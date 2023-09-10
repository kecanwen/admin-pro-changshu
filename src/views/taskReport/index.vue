<template>
  <div class="tasks-management-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="100px"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item label="物料">
            <el-input
              v-model="queryForm.MaterialCode"
              clearable
              placeholder="请输入物料编码或名称"
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
              v-model="queryForm.QualityStarDate"
              clearable
              placeholder="请输入生产日期"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="操作人">
            <el-input
              v-model="queryForm.CreatedName"
              clearable
              placeholder="请输入操作人"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="任务开始时间">
            <el-date-picker
              v-model="queryForm.WarehousInorOutAt"
              clearable
              placeholder="任务开始时间"
              type="datetime"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="任务完成时间">
            <el-date-picker
              v-model="queryForm.CompletedAt"
              clearable
              placeholder="任务完成时间"
              type="datetime"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="任务类型" prop="ContainerType">
            <el-select
              v-model="queryForm.ContainerType"
              clearable
              placeholder="请选择任务类型"
            >
              <el-option
                v-for="item in documentTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
          <el-button type="text" @click="handleFold">
            <span v-if="fold">展开</span>
            <span v-else>合并</span>
            <vab-icon
              class="vab-dropdown"
              :class="{ 'vab-dropdown-active': fold }"
              icon="arrow-up-s-line"
            />
          </el-button>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-button type="primary" @click="handleDownload">导出 Excel</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="list"
      @selection-change="setSelectRows"
    >
      <!-- <el-table-column align="center" show-overflow-tooltip type="selection" /> -->
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column align="center" label="操作人" prop="CreatedName" />
      <el-table-column
        align="center"
        label="任务开始时间"
        prop="WarehousInorOutAt"
        width="160"
      />
      <el-table-column
        align="center"
        label="任务完成时间 "
        prop="CompletedAt"
        width="160"
      />
      <el-table-column align="center" label="托盘号" prop="ContainerCode" />
      <el-table-column
        align="center"
        label="物料编码"
        prop="MaterialsCode"
        width="150"
      />
      <el-table-column
        align="center"
        label="物料名称"
        prop="MaterialsName"
        width="150"
      />
      <el-table-column
        align="center"
        label="物料类型"
        prop="MaterialType"
        width="130"
      />
      <el-table-column align="center" label="批次" prop="BatchNo" width="110" />
      <el-table-column align="center" label="数量" prop="Number" width="110" />
      <el-table-column
        align="center"
        label="生产日期"
        prop="QualityStarDate"
        width="110"
      />
      <el-table-column align="center" label="单据类型" prop="Status" />
      <el-table-column
        align="center"
        label="位置"
        prop="CurrentLocation"
        width="110"
      />
      <el-table-column align="center" label="任务类型" prop="ContainerType" />
      <el-table-column
        align="center"
        label="创建时间"
        prop="CreatedAt"
        width="160"
      />

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
    getReportList,
    getExcelList,
    getMaterialsTypeOptionApi,
  } from '@/api/tasksManagement'

  export default {
    name: 'TasksManagement',
    components: {},
    data() {
      return {
        list: [],
        fold: true,
        downloadLoading: false,
        filename: '出入库任务记录表',
        autoWidth: true,
        bookType: 'xlsx',
        options: ['xlsx', 'csv', 'txt'],
        height: this.$baseTableHeight(3) - 30,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          materialsName: '',
        },
        documentTypeOptions: [
          { label: '入库', value: '1' },
          { label: '出库', value: '2' },
        ],
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
        } = await getReportList(this.queryForm)
        this.list = list
        this.total = total
        this.listLoading = false
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/utils/excel').then((excel) => {
          const filterVal = [
            'CreatedName',
            'WarehousInorOutAt',
            'CompletedAt',
            'ContainerCode',
            'MaterialsCode',
            'MaterialsName',
            'MaterialType',
            'BatchNo',
            'Number',
            'QualityStarDate',
            'Status',
            'CurrentLocation',
            'ContainerType',
          ]
          const tHeader = [
            '操作人',
            '任务开始时间',
            '任务结束时间',
            '托盘号',
            '物料编码',
            '物料名称',
            '物料类型',
            '批次',
            '数量',
            '生产日期',
            '单据类型',
            '位置',
            '任务类型',
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
