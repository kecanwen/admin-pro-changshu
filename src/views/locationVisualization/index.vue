<template>
  <div class="locationVisualization-management-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="状态视图" name="status">
        <SubRegionCom />
      </el-tab-pane>
      <el-tab-pane label="分区视图" name="subRegion">
        <SubRegionCom sub-region />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import SubRegionCom from './component/subRegionCom'
  export default {
    name: 'LocationVisualization',
    components: {
      SubRegionCom,
    },
    data() {
      return {
        activeName: 'status',
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
    },
  }
</script>
