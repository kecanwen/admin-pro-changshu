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
            <el-form-item>
              <el-button type="primary" @click="handleDownload">
                导出 Excel
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

    <el-table v-loading="listLoading" border :data="list">
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
    getExcelList,
    getList,
    getMaterialsTypeOptionApi,
  } from '@/api/unitLoadsManagement'
  import Edit from './components/tasksManagementEdit'
  import VabDraggable from 'vuedraggable'

  export default {
    name: 'UnitLoadsManagement',
    components: { Edit, VabDraggable },
    data() {
      return {
        list: [],
        materialsTypeList: [],
        fold: true,
        height: this.$baseTableHeight(3) - 30,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        checkList: [
          '入库时间',
          '当前位置',
          '物料编码',
          '物料名称',
          '数量',
          '批次',
          '生产日期',
          '容器编码',
          '单包重量',
          '有效期',
          '尺寸',
          '物料类型',
        ],
        columns: [
          {
            label: '入库时间',
            prop: 'CreatedAt',
            width: '160',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '当前位置',
            width: '150',
            prop: 'CurrentLocation',
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
            prop: 'Number',
            sortable: true,
          },
          {
            label: '批次',
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
            label: '容器编码',
            width: '110',
            prop: 'ContainerCode',
            sortable: true,
          },
          {
            label: '单包重量',
            width: '150',
            prop: 'SingleWeight',
            sortable: true,
          },
          {
            label: '有效期',
            width: '150',
            prop: 'EffectiveDate',
            sortable: true,
          },
          {
            label: '尺寸',
            width: '150',
            prop: 'ChiCun',
            sortable: true,
          },
          {
            label: '物料类型',
            width: '150',
            prop: 'Type',
            sortable: true,
          },
        ],
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
