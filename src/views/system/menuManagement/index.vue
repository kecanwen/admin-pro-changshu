<template>
  <div class="menu-management-container">
    <el-row :gutter="20">
      <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
        <el-card shadow="hover">
          <vab-query-form>
            <vab-query-form-top-panel :span="12">
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit('')"
              >
                添加
              </el-button>
            </vab-query-form-top-panel>
          </vab-query-form>
          <el-table
            v-loading="listLoading"
            border
            :data="list"
            row-key="Id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="标题" prop="MenuName" width="120" />
            <el-table-column label="Id" prop="Id" width="80" />
            <el-table-column label="名称" prop="Name" width="120" />
            <el-table-column label="路径" prop="Path" width="120" />
            <el-table-column label="vue文件路径" prop="Url" width="220" />
            <el-table-column label="图标" show-overflow-tooltip>
              <template #default="{ row }">
                <vab-icon :icon="row.Icon" />
              </template>
            </el-table-column>

            <el-table-column label="操作" show-overflow-tooltip width="200">
              <template #default="{ row }">
                <el-button type="primary" @click="handleEdit(row)">
                  <vab-icon icon="edit-2-line" />
                  编辑
                </el-button>
                <el-button type="danger" @click="handleDelete(row)">
                  <vab-icon icon="delete-bin-6-line" />
                  删除
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
        </el-card>
      </el-col>
    </el-row>
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getTree } from '@/api/menuManagement'
  import Edit from './components/MenuManagementEdit'

  export default {
    name: 'MenuManagement',
    components: { Edit },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        list: [],
        listLoading: true,
      }
    },

    async created() {
      await this.fetchData()
    },
    methods: {
      handleEdit(row) {
        if (row && row.Path) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.Id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ id: row.Id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        }
      },
      async fetchData() {
        this.listLoading = true
        const {
          data: { list },
        } = await getTree()
        this.list = list
        this.listLoading = false
      },
      handleNodeClick() {
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
