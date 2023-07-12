<template>
  <div class="unitLoads-management-container">
    <vab-query-form>
      <!-- <vab-query-form-left-panel :span="12">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          添加
        </el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete($event)"
        >
          批量删除
        </el-button>
      </vab-query-form-left-panel> -->
      <vab-query-form-right-panel :span="12">
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
        v-if="false"
        align="center"
        label="供应商 "
        prop="Supplier"
        width="130"
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
      <el-table-column align="center" label="数量" prop="number" />
      <el-table-column align="center" label="批次" prop="BatchNo" width="150" />
      <el-table-column
        align="center"
        label="单包重量"
        prop="Str1"
        width="150"
      />
      <el-table-column
        align="center"
        label="生产日期"
        prop="Str2"
        width="150"
      />
      <el-table-column align="center" label="有效期" prop="Str3" width="150" />
      <el-table-column align="center" label="尺寸" prop="Str4" width="150" />

      <el-table-column
        align="center"
        label="物料类型"
        prop="Type"
        width="150"
      />
      <el-table-column align="center" label="判定区分" prop="QCStatus" />
      <el-table-column align="center" label="货位类型" prop="CKMC" />
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

      <!-- <el-table-column align="center" label="操作" width="255">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">强制完成</el-button>
          <el-button type="text" @click="handleDelete(row)">取消任务</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑任务</el-button>
          <el-button type="text" @click="handleDelete(row)">暂停任务</el-button>
        </template>
      </el-table-column> -->
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
  import { doDelete, getList } from '@/api/unitLoadsManagement'
  import Edit from './components/tasksManagementEdit'

  export default {
    name: 'UnitLoadsManagement',
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
    },
  }
</script>
