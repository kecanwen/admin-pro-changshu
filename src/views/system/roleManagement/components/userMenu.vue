<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-tree
      :data="treeList"
      :default-checked-keys="defaultCheckedNode"
      node-key="id"
      :props="defaultProps"
      show-checkbox
      @check="changeSomeChange"
    />
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getMenuTrees, setDoAllots } from '@/api/roleManagement'
  export default {
    name: 'UserMenu',
    data() {
      return {
        defaultCheckedNode: [],
        curId: '',
        defaultProps: {
          children: 'children',
          label: 'text',
        },
        treeList: [],
        title: '',
        dialogFormVisible: false,
        options: [],
        form: {
          Id: '',
          list_str: '',
        },
      }
    },
    methods: {
      changeSomeChange(cur, obj) {
        this.form.list_str = obj.checkedKeys.join('-')
      },
      getDefaultCheckedNode(treeList) {
        let checkArr = []
        const getCheckList = (list) => {
          list.forEach((item) => {
            if (item.checked) {
              checkArr.push(item.id)
            }
            if (item.children) {
              getCheckList(item.children)
            }
          })
        }
        getCheckList(treeList)
        return checkArr
      },

      async fetchData(id) {
        let params = { id }
        let { data } = await getMenuTrees(params)
        let list = JSON.parse(data)
        this.treeList = list
        this.defaultCheckedNode = this.getDefaultCheckedNode(list || [])
      },
      showEdit(row) {
        this.title = '分配菜单'
        this.form = Object.assign({}, row)
        this.fetchData(row.Id)
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
      },
      async save() {
        let data = { ro_no: this.form.Id, ar: this.form.list_str }
        const { msg } = await setDoAllots(data)
        this.$baseMessage(msg, 'success', 'vab-hey-message-success')
        this.$emit('fetch-data')
        this.close()
      },
    },
  }
</script>
