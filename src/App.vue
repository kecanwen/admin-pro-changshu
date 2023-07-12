<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        lastClickTime: 0,
      }
    },
    mounted() {
      window.addEventListener('load', this.handleLoad)
      window.addEventListener('unload', this.handleUnload)
      window.addEventListener('click', this.watchScreenActive)
    },
    beforeDestroy() {
      window.removeEventListener('load', this.handleLoad)
      window.removeEventListener('unload', this.handleUnload)
      window.removeEventListener('click', this.watchScreenActive)
    },
    methods: {
      //关闭标签退出登陆态  刷新不退出登陆态
      handleLoad() {
        let beforeTime = JSON.parse(localStorage.getItem('beforeTime'))
        let _gap_time = new Date().getTime() - beforeTime
        console.log(_gap_time, '间隔时间')
        if (_gap_time > 5000) {
          localStorage.removeItem('admin-pro-token')
        }
      },
      handleUnload() {
        let beforeTime = new Date().getTime()
        localStorage.setItem('beforeTime', JSON.stringify(beforeTime))
        console.log(beforeTime, '结束时间')
      },
      //超30分钟不操作 退出登陆
      watchScreenActive() {
        let curStamp = new Date().getTime()
        let gap = curStamp - this.lastClickTime
        if (gap < 30 * 60 * 1000) {
          this.lastClickTime = new Date().getTime()
        } else {
          localStorage.removeItem('admin-pro-token')
        }
      },
    },
  }
</script>
