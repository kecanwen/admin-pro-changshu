<template>
  <div class="SubRegionCom">
    <div class="SubRegionComTop">
      <el-form ref="form" inline :model="form">
        <el-form-item inline-message label="排:" label-width="40px">
          <el-select
            v-model="form.curArrange"
            placeholder="请选择排数"
            @change="changeCurArrange"
          >
            <el-option
              v-for="(item, index) in arrangeList"
              :key="index"
              :label="item.text"
              :value="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="subRegion"
          inline-message
          label="分区:"
          label-width="80px"
        >
          <el-select
            v-model="form.partition"
            placeholder="请选择"
            @change="changeRegion"
          >
            <el-option
              v-for="item in materialsTypeList"
              :key="item.Code"
              :label="item.Name"
              :value="item.Name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="subRegion"
          inline-message
          label="分层:"
          label-width="80px"
        >
          <el-select
            v-model="form.salePosition"
            placeholder="请选择"
            @change="changeSalePosition"
          >
            <el-option label="高货位" value="高货位" />
            <el-option label="低货位" value="低货位" />
          </el-select>
        </el-form-item>
        <el-button
          v-if="subRegion"
          :disabled="isDisabled"
          icon="el-icon-plus"
          type="primary"
          @click="AddxGroup"
        >
          添加
        </el-button>
        <el-button
          v-if="subRegion"
          :disabled="isDisabled"
          icon="el-icon-delete"
          type="danger"
          @click="DeletexGroup"
        >
          删除
        </el-button>
        <el-button
          v-if="subRegion"
          :disabled="isDisabled"
          icon="el-icon-refresh-right"
          @click="resetAllStatus"
        >
          重置
        </el-button>
      </el-form>
    </div>
    <div class="SubRegionComBottom">
      <table>
        <tr v-for="(item, index) in myArr" :key="index">
          <td v-for="(item1, index1) in item" :key="item1.Id">
            <div
              class="unit"
              @mousedown.passive="getClipStart(index, index1)"
              @mouseup.passive="getClipEnd(index, index1)"
            >
              <span v-if="index1 === 0 && index !== myArrLength">
                {{ myArrLength - index }}
              </span>
              <span v-else-if="index === myArrLength && index1 !== 0">
                {{ index1 }}
              </span>
              <span v-else-if="index === myArrLength && index1 === 0"></span>
              <el-popover v-else class="item" effect="light" placement="bottom">
                <div class="popoverContent">
                  <p>{{ item1.UserCode }}</p>
                  <hr />
                  <el-table v-if="gridData.length > 0" :data="gridData">
                    <el-table-column
                      label="物料代码"
                      property="MaterialCode"
                      width="150"
                    />
                    <el-table-column
                      label="物料名称"
                      property="MaterialName"
                      width="100"
                    />
                    <el-table-column
                      label="包装单位"
                      property="SmallestUnit"
                      width="100"
                    />
                    <el-table-column
                      label="库存数量"
                      property="Num"
                      width="100"
                    />
                  </el-table>
                </div>
                <div
                  slot="reference"
                  class="girds ivu-btn ivu-btn-default"
                  :style="
                    item1.IsActive
                      ? { backgroundColor: 'rgba(0,94,255,.29)' }
                      : { backgroundColor: computedBackground(item1) }
                  "
                  type="button"
                  @click.passive="getReferenceDetail(item1.UserCode)"
                >
                  <img
                    style="z-index: 1"
                    v-if="item1.ForbidInbound || item1.ForbidOutbound"
                    src="../../../assets/stock_images/forbidden.png"
                  />
                  <img
                    style="z-index: 2"
                    v-if="item1.IsLoaded"
                    src="../../../assets/stock_images/box.png"
                  />
                  <img
                    style="z-index: 3"
                    v-if="item1.IsLocked"
                    src="../../../assets/stock_images/lock.png"
                  />
                </div>
              </el-popover>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="colorContent">
      <ul>
        <li v-for="(item, index) in colorList" :key="index">
          <span class="name">{{ item.name }}</span>
          <span class="color" :style="{ background: item.color }"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {
    queryManagerLocationApi,
    getMaterialsTypeOptionApi,
    getMaterialsListApi,
    AddxGroupApi,
    DeletexGroupApi,
  } from '../../../api/locationVisualization'

  export default {
    name: 'SubRegionCom',
    props: {
      subRegion: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        gridData: [],
        operationType: undefined,
        form: {
          curArrange: '01',
          partition: '',
          salePosition: '',
        },
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        myArr: [],
        ids: [],
        materialsTypeList: [],
        arrangeList: [
          { index: '01', text: '第1排' },
          { index: '02', text: '第2排' },
          { index: '03', text: '第3排' },
          { index: '04', text: '第4排' },
          { index: '05', text: '第5排' },
          { index: '06', text: '第6排' },
          { index: '07', text: '第7排' },
          { index: '08', text: '第8排' },
        ],
        isDisabled: true,
        colorList: [
          { name: '砂芯材料', color: 'rgba(153,255,204)', code: 'SXCL' },
          { name: '孕育剂成品', color: 'rgba(204,193,218)', code: 'YYJCP' },
          { name: '发热剂成品', color: 'rgba(255,255,0)', code: 'FRJCP' },
          { name: '熔剂成品', color: 'rgba(217,150,148)', code: 'RJCP' },
          { name: '冒口成品', color: 'rgba(230,185,184)', code: 'MKCP' },
          { name: 'Premix半成品', color: 'rgba(204,204,255)', code: 'Premix' },
          {
            name: 'Pre-kitting预配料',
            color: 'rgb(255,33,40)',
            code: 'Pre-kitting',
          },
          {
            name: '砂芯原料',
            color: 'rgba(230,224,236)',
            code: 'SXYL',
          },
          { name: '孕育剂原料', color: 'rgba(102,204,255)', code: 'YYJYL' },
          { name: '熔剂原料', color: 'rgba(185,205,229)', code: 'RJYL' },
          { name: '冒口&涂料原料', color: 'rgb(80,255,127)', code: 'MKTLYL' },
          { name: '空托盘', color: 'rgba(230,185,184)', code: 'KTP' },
        ],
      }
    },
    computed: {
      myArrLength() {
        return (this.myArr && this.myArr.length - 1) || 0
      },
    },
    created() {
      this.queryManagerLocation()
      this.getMaterialsTypeOptionMethod()
    },
    methods: {
      computedBackground(item) {
        let arr = this.colorList.filter((ite) => {
          return ite.name === item.Group && this.form.partition === item.Group
        })
        if (this.form.partition) {
          return arr.length > 0 ? arr[0].color : '#fff'
        } else {
          return '#fff'
        }
      },
      async AddxGroup() {
        if (!this.checkIsNotElement()) {
          return false
        }
        let ids = this.ids.join(',')
        let data = {
          ids,
          xGroup:
            this.operationType == 1
              ? this.form.partition
              : this.operationType == 2
              ? this.form.salePosition
              : '',
          type: this.operationType,
        }
        const res = await AddxGroupApi(data)
        if (res.code == 200) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.msg)
        }
        this.queryManagerLocation()
      },
      async DeletexGroup() {
        if (!this.checkIsNotElement()) {
          return false
        }
        let ids = this.ids.join(',')
        let data = {
          ids,
          type: this.operationType,
        }
        const res = await DeletexGroupApi(data)
        if (res.code == 200) {
          this.$message.success('刪除成功')
        } else {
          this.$message.error(res.msg)
        }
      },
      checkIsNotElement() {
        let partition = this.form.partition
        let salePosition = this.form.salePosition
        if (!partition && !salePosition) {
          this.$message.error('请选择分区或者分层')
          return false
        }
        if (this.ids.length === 0) {
          this.$message.error('请选择添加或者删除区域')
          return false
        }
        return true
      },
      changeRegion() {
        this.form.salePosition = ''
        this.operationType = 1
      },
      changeSalePosition() {
        this.form.partition = ''
        this.operationType = 2
      },
      async getMaterialsTypeOptionMethod() {
        const res = await getMaterialsTypeOptionApi()
        if (res.code == 200) {
          this.materialsTypeList = res.data.list
        } else {
          this.materialsTypeList = []
        }
      },
      async getReferenceDetail(locationUserCode) {
        const res = await getMaterialsListApi({ locationUserCode })
        if (res.code === 200) {
          this.gridData = (res.data && res.data.list) || []
        } else {
          this.gridData = []
        }
      },
      resetAllStatus() {
        let arr = this.myArr
        arr.forEach((item) => {
          item.forEach((item1) => {
            item1.IsActive = false
          })
        })
        this.isDisabled = true
      },
      changeCurArrange(index) {
        this.form.curArrange = index
        this.queryManagerLocation()
      },
      createMyArr(list) {
        let arr = []
        let subArr1 = [{}]
        let subArr2 = [{}]
        let subArr3 = [{}]
        let subArr4 = [{}]
        list.forEach((item) => {
          item.IsActive = false
          let level = item.Level
          switch (level) {
            case 1:
              subArr1.push(item)
              break
            case 2:
              subArr2.push(item)
              break
            case 3:
              subArr3.push(item)
              break
            case 4:
              subArr4.push(item)
              break
          }
        })
        arr = [subArr4, subArr3, subArr2, subArr1, subArr4]
        return arr
      },
      getIsDisabled(arr) {
        let status = true
        arr.forEach((item) => {
          item.forEach((item1) => {
            if (item1.IsActive === true) {
              status = false
            }
          })
        })
        this.isDisabled = status
      },
      getClipStart(index, index1) {
        this.startX = index
        this.startY = index1
      },
      getClipEnd(index, index1) {
        this.endX = index
        this.endY = index1
        // eslint-disable-next-line no-unused-vars
        let smallX = 0,
          // eslint-disable-next-line no-unused-vars
          smallY = 0,
          // eslint-disable-next-line no-unused-vars
          bigX = 0,
          // eslint-disable-next-line no-unused-vars
          bigY = 0
        if (this.startX >= this.endX) {
          smallX = this.endX
          bigX = this.startX
        } else {
          smallX = this.startX
          bigX = this.endX
        }
        if (this.startY >= this.endY) {
          smallY = this.endY
          bigY = this.startY
        } else {
          smallY = this.startY
          bigY = this.endY
        }
        let arr = this.myArr
        let ids = this.ids
        arr.forEach((item, index_X) => {
          item.forEach((item1, index_Y) => {
            if (
              index_X >= smallX &&
              index_X <= bigX &&
              index_Y >= smallY &&
              index_Y <= bigY
            ) {
              item1.IsActive = true
              ids.push(item1.Id)
            }
          })
        })
        this.myArr = arr
        this.ids = ids
        this.getIsDisabled(arr)
      },
      queryManagerLocation() {
        queryManagerLocationApi({ rackCode: this.form.curArrange }).then(
          (res) => {
            let list = res.data.list
            this.myArr = this.createMyArr(list)
          }
        )
      },
    },
  }
</script>

<style lang="scss" scoped>
  .SubRegionCom {
    .SubRegionComTop {
      display: flex;
    }
    .SubRegionComBottom {
      overflow-x: scroll;
      table {
        tr {
          td {
            .unit {
              width: 30px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              .girds {
                position: relative;
                width: 100%;
                height: 40px;
                padding-top: 8px;
                font-size: 14px;
                cursor: pointer;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                img {
                  position: absolute;
                  left: 0;
                  width: 26px;
                  height: 25px;
                }
                &:hover {
                  border-color: #57a3f3;
                }
              }
            }
          }
        }
      }
    }
    .colorContent {
      ul {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        li {
          display: flex;
          align-items: center;
          margin-right: 30px;
          margin-bottom: 10px;
          list-style: none;
          .name {
            margin-right: 8px;
          }
          .color {
            display: inline-block;
            width: 32px;
            height: 20px;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
