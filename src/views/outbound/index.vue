<template>
  <div class="receiveOrder-management-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.materialsName"
              clearable
              placeholder="请输入库单号"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="list"
      @selection-change="setSelectRows"
    >
      <!-- <el-table-column align="center" show-overflow-tooltip type="selection" /> -->
      <!-- 嵌套表格 -->
      <el-table-column align="center" show-overflow-tooltip type="selection" />
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            v-loading="listLoading"
            :data="scope.row.items"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column v-if="false" align="center" label="Id" prop="Id" />
            <el-table-column
              align="center"
              label="物料编码"
              prop="materialsCode"
              width="160"
            />
            <el-table-column
              align="center"
              label="物料名称"
              prop="materialsName"
              width="160"
            />
            <el-table-column align="center" label="批次号" prop="batchNo" />
            <el-table-column
              align="center"
              label="单包重量"
              prop="singleWeight"
            />
            <el-table-column
              align="center"
              label="生产日期"
              prop="produceDate"
            />
            <el-table-column
              align="center"
              label="有效期"
              prop="validityDate"
            />
            <el-table-column
              align="center"
              label="尺寸"
              prop="size"
              width="160"
            />
            <el-table-column align="center" label="单位" prop="smallestUnit" />
            <el-table-column align="center" label="物料类型" prop="type" />
            <el-table-column align="center" label="数量" prop="number" />
          </el-table>
        </template>
      </el-table-column>

      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column align="center" label="入库时间 " prop="CreatedAt" />
      <el-table-column align="center" label="当前位置" prop="CurrentLocation" />
      <el-table-column align="center" label="托盘号" prop="ContainerCode" />
      <el-table-column align="center" label="创建人 " prop="RegisteredBy" />
      <el-table-column
        align="center"
        label="创建时间"
        prop="CreatedAt"
        width="160"
      />

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="150"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
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
    doDelete,
    getList,
    getOutExitListApi,
  } from '@/api/outboundManagement'
  import Edit from './components/receiveOrderManagementEdit'

  export default {
    name: 'OutboundManagement',
    components: { Edit },
    data() {
      return {
        outExitList: [],
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          materialsName: '',
        },
      }
    },
    created() {
      this.fetchData()
      this.getOutExitListMethod()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.Id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.Id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.Id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.Id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
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
      async getOutExitListMethod() {
        const res = await getOutExitListApi()
        if (res.code == 200) {
          this.outExitList = res.data.list
        } else {
          this.outExitList = []
        }
      },
    },
  }
</script>
