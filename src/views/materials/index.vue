<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div class="materials-management-container">
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
              v-model="queryForm.MaterialName"
              clearable
              placeholder="请输入物料名称"
            />
          </el-form-item>
          <el-form-item label="物料类别" prop="MaterialType">
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
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="queryData"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="12">
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
        <el-button style="padding: 0 !important" type="primary">
          <div style="position: relative">
            <span style="position: absolute; top: 8px; left: 40px">导入</span>
            <input
              ref="importFile"
              accept=".xlsx, .xls"
              style="width: 96px; height: 30px; opacity: 0"
              type="file"
              @change="onImportExcel"
            />
          </div>
        </el-button>
      </vab-query-form-left-panel>

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
      <el-table-column align="center" show-overflow-tooltip type="selection" />
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
    UploadExcel,
    getMaterialsTypeOptionApi,
  } from '@/api/materialsManagement'
  import Edit from './components/materialsManagementEdit'
  import VabDraggable from 'vuedraggable'

  export default {
    name: 'MaterialsManagement',
    // eslint-disable-next-line vue/no-unused-components
    components: { Edit, VabDraggable },
    data() {
      return {
        list: [],
        materialsTypeList: [],
        listLoading: true,
        height: this.$baseTableHeight(1),
        layout: 'total, sizes, prev, pager, next, jumper',
        checkList: [
          '物料编码',
          '物料名称',
          '单位',
          '物料类别',
          '单层数量',
          '单层高度',
          '单个重量',
          '保质期预警',
          '创建时间',
        ],
        columns: [
          {
            label: '物料编码',

            prop: 'Code',
            width: '150',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '物料名称',
            width: '150',
            prop: 'Name',
            sortable: true,
          },
          {
            label: '单位',
            width: '100',
            prop: 'SmallestUnit',
            sortable: true,
          },
          {
            label: '物料类别',
            width: '150',
            prop: 'Type',
            sortable: true,
          },
          {
            label: '单层数量',
            width: '120',
            prop: 'ShortName',
            sortable: true,
          },
          {
            label: '单层高度',
            width: '120',
            prop: 'Barcode',
            sortable: true,
          },
          {
            label: '单个重量',
            width: '120',
            prop: 'SingleWeight',
            sortable: true,
          },
          {
            label: '保质期预警',
            width: '120',
            prop: 'Days',
            sortable: true,
          },
          {
            label: '创建时间',
            width: '160',
            prop: 'CreatedAt',
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
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) this.height = this.$baseTableHeight(1) + 210
        else this.height = this.$baseTableHeight(1)
      },
      onImportExcel(file) {
        // 获取上传的文件对象
        const files = file.target && file.target.files[0]
        const fd = new FormData()
        fd.append('File', files)
        this.UploadExcelMethod(fd)
      },
      async UploadExcelMethod(fd) {
        this.listLoading = true
        const { msg } = await UploadExcel(fd)
        this.$baseMessage(msg, 'success', 'vab-hey-message-success')
        this.listLoading = false
        await this.fetchData()
      },
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
