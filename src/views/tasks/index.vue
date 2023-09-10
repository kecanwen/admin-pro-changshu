<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div class="tasks-management-container">
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
              v-model="queryForm.ContainerCodeToMatch"
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
          <el-form-item v-show="!fold" label="起点位置">
            <el-input
              v-model="queryForm.FromLocationUserCodeToMatch"
              clearable
              placeholder="请输入起点位置"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="终点位置">
            <el-input
              v-model="queryForm.ToLocationUserCodeToMatch"
              clearable
              placeholder="请输入订单号"
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
      <vab-query-form-left-panel>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <vab-draggable v-bind="dragOptions" :list="columns">
              <div v-for="(item, index) in columns" :key="item + index">
                <vab-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ item.label }}
                </el-checkbox>
              </div>
            </vab-draggable>
          </el-checkbox-group>
          <template #reference>
            <el-button
              icon="el-icon-setting"
              style="margin: 0 1000px 10px 0 !important"
              type="primary"
            >
              可拖拽列设置
            </el-button>
          </template>
        </el-popover>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column v-if="false" align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="Id" prop="Id" />
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
        :width="item.width"
      />

      <el-table-column align="center" label="操作" width="160">
        <template #default="{ row }">
          <el-button type="text" @click="handleComplete(row)">
            强制完成
          </el-button>
          <el-button type="text" @click="handleCancel(row)">取消任务</el-button>
          <!-- <el-button type="text" @click="handleEdit(row)">编辑任务</el-button>
          <el-button type="text" @click="handleDelete(row)">暂停任务</el-button> -->
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
    doComplete,
    doCancel,
    getList,
    getMaterialsTypeOptionApi,
  } from '@/api/tasksManagement'
  import Edit from './components/tasksManagementEdit'
  import VabDraggable from 'vuedraggable'

  export default {
    name: 'TasksManagement',
    components: { Edit, VabDraggable },
    data() {
      return {
        fold: true,
        materialsTypeList: [],
        height: this.$baseTableHeight(3) - 30,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        checkList: [
          '任务号',
          '容器编码',
          '物料编码',
          '物料名称',
          '数量',
          '批次号',
          '生产日期',
          '物料类型',
          '起点',
          '终点',
          '优先级',
          '巷道',
          '创建时间',
          '任务类型',
        ],
        columns: [
          {
            label: '任务号',
            prop: 'TaskCode',
            width: '130',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '容器编码',
            width: '150',
            prop: 'ContainerCode',
            sortable: true,
          },
          {
            label: '物料编码',
            width: '160',
            prop: 'MaterialCode',
            sortable: true,
          },
          {
            label: '物料名称',
            width: '160',
            prop: 'MaterialName',
            sortable: true,
          },
          {
            label: '数量',
            width: '100',
            prop: 'SumNumber',
            sortable: true,
          },
          {
            label: '批次号',
            width: '120',
            prop: 'BatchNo',
            sortable: true,
          },
          {
            label: '生产日期',
            width: '150',
            prop: 'ProduceDate',
            sortable: true,
          },
          {
            label: '物料类型',
            width: '150',
            prop: 'Type',
            sortable: true,
          },
          {
            label: '起点',
            width: '110',
            prop: 'FromLocation',
            sortable: true,
          },
          {
            label: '终点',
            width: '110',
            prop: 'ToLocation',
            sortable: true,
          },
          {
            label: '优先级',
            width: '110',
            prop: 'Priority',
            sortable: true,
          },
          {
            label: '巷道',
            width: '150',
            prop: 'LanewayName',
            sortable: true,
          },
          {
            label: '创建时间',
            width: '160',
            prop: 'CreatedAt',
            sortable: true,
          },
          {
            label: '任务类型',
            width: '150',
            prop: 'TaskType',
            sortable: true,
          },
        ],
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          materialsName: '',
        },
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
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
      handleComplete(row) {
        if (row.Id) {
          this.$baseConfirm('你确定要操作当前项吗?', null, async () => {
            const { msg } = await doComplete({
              taskCode: row.TaskCode,
              taskType: row.TaskType,
              containerCode: row.ContainerCode,
            })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.fetchData()
          })
        }
      },
      handleCancel(row) {
        if (row.Id) {
          this.$baseConfirm('你确定要操作当前项吗?', null, async () => {
            const { msg } = await doCancel({
              id: row.Id,
              // containerCode: row.ContainerCode,
            })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.fetchData()
          })
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
