<template>
  <div class="rackLocations-management-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="25">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.plainName"
              clearable
              placeholder="请输入货位编码"
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
      <el-table-column align="center" show-overflow-tooltip type="selection" />
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column
        align="center"
        label="编码"
        prop="UserCode"
        width="150"
      />
      <el-table-column align="center" label="货架" prop="RackCode" />
      <el-table-column align="center" label="列" prop="Column" />
      <el-table-column align="center" label="层" prop="Level" />
      <el-table-column align="center" label="巷道" prop="RackName" />
      <el-table-column align="center" label="是否锁定" prop="IsLocked" />
      <el-table-column align="center" label="是否有货" prop="IsLoaded" />
      <el-table-column align="center" label="是否禁入" prop="ForbidInbound" />
      <el-table-column align="center" label="是否禁出" prop="ForbidOutbound" />
      <el-table-column align="center" label="货位类型" prop="Subgroup" />

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row, 1)">
            {{ row.ForbidInbound == '否' ? '禁止入' : '允许入' }}
          </el-button>
          <el-button type="text" @click="handleEdit(row, 2)">
            {{ row.ForbidOutbound == '否' ? '禁止出' : '允许出' }}
          </el-button>
          <el-button type="text" @click="handleEdit(row, 3)">
            {{
              row.ForbidInbound == '否' && row.ForbidOutbound == '是'
                ? '一键允许'
                : row.ForbidInbound == '是' && row.ForbidOutbound == '否'
                ? '一键允许'
                : row.ForbidInbound == '是' && row.ForbidOutbound == '是'
                ? '一键允许'
                : '一键禁止'
            }}
          </el-button>
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
    getList,
    disableOrEnableInbound,
    disableOrEnableOutbound,
    disableOrEnableAll,
  } from '@/api/rackLocationsManagement'
  import Edit from './components/rackLocationsManagementEdit'

  export default {
    name: 'RackLocationsManagement',
    components: { Edit },
    data() {
      return {
        disableOrEnableInbound,
        disableOrEnableOutbound,
        disableOrEnableAll,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
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
      async handleEdit(row, type) {
        let methodAPI = null
        let curType = 1
        if (type == 1) {
          methodAPI = this.disableOrEnableInbound
          curType = row.ForbidInbound == '是' ? 0 : 1
        }
        if (type == 2) {
          methodAPI = this.disableOrEnableOutbound
          curType = row.ForbidOutbound == '是' ? 0 : 1
        }
        if (type == 3) {
          methodAPI = this.disableOrEnableAll
          curType =
            row.ForbidInbound == '否' && row.ForbidOutbound == '否'
              ? 1
              : row.ForbidInbound == '是' && row.ForbidOutbound == '是'
              ? 0
              : 1
        }
        const { msg } = await methodAPI({ id: row.Id, type: curType })
        this.$baseMessage(msg, 'success', 'vab-hey-message-success')
        this.fetchData()
      },
      setSelectRows(val) {
        this.selectRows = val
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
