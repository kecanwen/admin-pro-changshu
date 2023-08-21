<template>
  <div class="receiveOrder-management-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="70px"
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
              v-model="queryForm.ProduceDate"
              clearable
              placeholder="请输入生产日期"
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
            <!-- <el-button type="text" @click="handleFold">
              <span v-if="fold">展开</span>
              <span v-else>合并</span>
              <vab-icon
                class="vab-dropdown"
                :class="{ 'vab-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button> -->
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-select
              v-model="queryForm.outExitNum"
              clearable
              placeholder="请选择出库口"
            >
              <el-option
                v-for="(item, index) in outExitList"
                :key="index"
                :label="item.Name"
                :value="item.UserCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-box" type="primary" @click="manualOutExit">
              手工出库
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-box" type="primary" @click="cancelTask">
              取消任务
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
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
      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            v-loading="listLoading"
            :data="scope.row.items"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column v-if="false" align="center" label="Id" prop="Id" />

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
          </el-table>
        </template>
      </el-table-column> -->

      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column align="center" label="任务状态 " prop="FeatureCode" />
      <el-table-column
        align="center"
        label="入库时间 "
        prop="CreatedAt"
        width="160"
      />
      <el-table-column
        align="center"
        label="当前位置"
        prop="CurrentLocation"
        width="100"
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
      <el-table-column align="center" label="批次号" prop="BatchNo" />
      <el-table-column align="center" label="生产日期" prop="ProduceDate" />
      <el-table-column align="center" label="库存数量" prop="SumNumber" />
      <el-table-column align="center" label="托盘号" prop="ContainerCode" />
      <el-table-column align="center" label="入库人 " prop="RegisteredBy" />
      <!-- <el-table-column
        align="center"
        label="创建时间"
        prop="CreatedAt"
        width="160"
      /> -->
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
    GetManualOutAPI,
    GetCancelTaskAPI,
  } from '@/api/outboundManagement'
  import Edit from './components/receiveOrderManagementEdit'
  import { mapGetters } from 'vuex'
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
        selectRowsString: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          materialsName: '',
          outExitNum: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        username: 'user/username',
      }),
    },
    created() {
      this.fetchData()
      this.getOutExitListMethod()
    },
    methods: {
      async manualOutExit() {
        let data = {
          unitLoadIds: this.selectRowsString,
          toLocationCode: this.queryForm.outExitNum,
          createdBy: this.username,
        }
        const { msg, code } = await GetManualOutAPI(data)
        code == 200
          ? this.$baseMessage(msg, 'success', 'vab-hey-message-success')
          : this.$baseMessage(msg, 'error', 'vab-hey-message-error')
        await this.fetchData()
      },
      async cancelTask() {
        let data = {
          unitLoadIds: this.selectRowsString,
        }
        const { msg, code } = await GetCancelTaskAPI(data)
        code == 200
          ? this.$baseMessage(msg, 'success', 'vab-hey-message-success')
          : this.$baseMessage(msg, 'error', 'vab-hey-message-error')
        await this.fetchData()
      },
      setSelectRows(arr) {
        this.selectRows = arr
        this.selectRowsString = arr.map((item) => item.Id).toString()
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
