<template>
  <div class="materials-management-container">
    <vab-query-form>
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
        <el-button type="primary">
          <div style="position: relative">
            <span style="position: absolute; left: 12px">导入</span>
            <input
              ref="importFile"
              accept=".xlsx, .xls"
              style="opacity: 0; width: 80px; height: 12px"
              type="file"
              @change="onImportExcel"
            />
          </div>
        </el-button>
        <!--        <el-button icon="el-icon-plus" type="primary">-->
        <!--          <a-->
        <!--            download="../../assets/excel/物料.xlsx"-->
        <!--            href="../../assets/excel/物料.xlsx"-->
        <!--          >-->
        <!--            导出模板-->
        <!--          </a>-->
        <!--        </el-button>-->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.materialsName"
              clearable
              placeholder="请输入物料代码或名称"
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
        label="物料编码 "
        prop="Code"
        width="160"
      />
      <el-table-column
        align="center"
        label="物料名称"
        prop="Name"
        width="230"
      />
      <el-table-column align="center" label="单位 " prop="SmallestUnit" />
      <el-table-column align="center" label="物料类别" prop="Type" />
      <el-table-column align="center" label="单层数量" prop="ShortName" />
      <el-table-column align="center" label="单层高度" prop="Barcode" />
      <el-table-column align="center" label="单个重量" prop="SingleWeight" />
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
  import { doDelete, getList, UploadExcel } from '@/api/materialsManagement'
  import Edit from './components/materialsManagementEdit'
  import XLSX from 'xlsx'

  export default {
    name: 'MaterialsManagement',
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
      onImportExcel(file) {
        // 获取上传的文件对象
        const { files } = file.target
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = (event) => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            let data = []
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              data = data.concat(
                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              )
            }
            // 最终获取到并且格式化后的 json 数据
            const uploadData = data.map((item) => {
              return {
                Code: item['物料代码'],
                Name: item['物料名称'],
                Type: item['物料类别'],
              }
            })
            console.log(uploadData) //这里得到了后端需要的json数据，调用接口传给后端就行了
            this.UploadExcelMethod(uploadData)
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0])
      },
      async UploadExcelMethod(filebase) {
        let aaa = await UploadExcel({ filebase })
        console.log(aaa, '_______')
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.Id) {
          debugger
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
