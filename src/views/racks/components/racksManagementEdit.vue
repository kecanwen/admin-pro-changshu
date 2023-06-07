<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="1000px"
    @close="close"
  >
    <el-form ref="form" label-width="80px">
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
        <el-table-column align="center" label="编码 " prop="UserCode" />
        <el-table-column align="center" label="名称" prop="Name" />
        <el-table-column
          align="center"
          label="入口"
          prop="ForbidInbound"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row.ForbidInbound == 0 ? '否' : '是'"
              :enterable="false"
              placement="top"
            >
              <el-switch
                v-model="row.ForbidInbound"
                @change="upForbidInbound(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="出口"
          prop="ForbidOutbound"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row.ForbidOutbound == 0 ? '否' : '是'"
              :enterable="false"
              placement="top"
            >
              <el-switch
                v-model="row.ForbidOutbound"
                @change="upForbidOutbound(row)"
              />
            </el-tooltip>
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
    </el-form>
  </el-dialog>
</template>

<script>
  import {
    getPlainList,
    updateForbidInbound,
    updateupForbidOutbound,
  } from '@/api/racksManagement'

  export default {
    name: 'RacksManagementEdit',
    data() {
      return {
        form: {},
        list: [],
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          plainName: '',
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      showEdit(row) {
        this.title = '可达性设置'
        this.form = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
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
        } = await getPlainList(this.queryForm)
        this.list = list
        this.total = total
        this.listLoading = false
      },
      async upForbidInbound(row) {
        if (row.Id) {
          const { msg } = await updateForbidInbound({ id: row.Id })
          this.$baseMessage(msg, 'success', 'vab-hey-message-success')
          this.fetchData()
        }
      },
      //禁出
      async upForbidOutbound(row) {
        if (row.Id) {
          const { msg } = await updateupForbidOutbound({ id: row.Id })
          this.$baseMessage(msg, 'success', 'vab-hey-message-success')
          this.fetchData()
        }
      },
    },
  }
</script>
