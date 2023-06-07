<template>
  <div class="receiveOrder-management-container">
    <vab-query-form>
      <!-- <vab-query-form-left-panel :span="12">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          添加
        </el-button>
      </vab-query-form-left-panel> -->
      <vab-query-form-right-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.materialsName"
              clearable
              placeholder="请输入仓库名"
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

    <el-table v-loading="listLoading" border :data="list">
      <!-- <el-table-column align="center" show-overflow-tooltip type="selection" /> -->
      <!-- 嵌套表格 -->
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
            />
            <el-table-column
              align="center"
              label="物料名称"
              prop="materialsName"
            />
            <el-table-column align="center" label="单位" prop="smallestUnit" />
            <el-table-column align="center" label="物料类型" prop="type" />
            <el-table-column align="center" label="入库数量" prop="number" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column align="center" label="入库单号 " prop="Code" />
      <el-table-column align="center" label="入库类型" prop="ReceiveType" />
      <el-table-column align="center" label="状态" prop="Status" />
      <el-table-column align="center" label="托盘号" prop="PalletNo" />
      <el-table-column align="center" label="供应商" prop="Supplier" />
      <el-table-column align="center" label="创建人 " prop="CreatedBy" />
      <el-table-column align="center" label="创建时间" prop="CreatedAt" />

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="150"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">上架</el-button>
          <!-- <el-button type="text" @click="handleDelete(row)">上架</el-button> -->
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
  import { doDelete, getList } from '@/api/receiveOrderManagement'
  import Edit from './components/groundingEdit'

  export default {
    name: 'ReceiveOrderManagement',
    components: { Edit },
    data() {
      return {
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
          this.$baseConfirm('你确定要上架当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.Id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.Id).join()
            this.$baseConfirm('你确定要上架选中项吗', null, async () => {
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
    },
  }
</script>
