<template>
  <div class="racks-management-container">
    <el-table
      v-loading="listLoading"
      border
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column
        v-if="false"
        align="center"
        show-overflow-tooltip
        type="selection"
      />
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column align="center" label="编号(排)" prop="UserCode" />
      <el-table-column align="center" label="列数" prop="Columns" />
      <el-table-column align="center" label="层数" prop="Levels" />
      <el-table-column align="center" label="巷道" prop="LanewayName" />
      <el-table-column
        v-if="false"
        align="center"
        label="入口"
        prop="EntrancesCount"
      />
      <el-table-column
        v-if="false"
        align="center"
        label="出口"
        prop="ExitsCount"
      />

      <el-table-column
        v-if="false"
        align="center"
        label="操作"
        show-overflow-tooltip
        width="150"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">可达性</el-button>
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
  import { getList } from '@/api/racksManagement'
  import Edit from './components/racksManagementEdit'

  export default {
    name: 'RacksManagement',
    components: { Edit },
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        rackId: 0,
        queryForm: {
          pageNo: 1,
          pageSize: 10,
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
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
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
