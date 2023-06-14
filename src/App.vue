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
        beforeTime: 0,
        lastClickTime: 0,
      }
    },
    mounted() {
      window.addEventListener('beforeunload', this.handleBeforeUnload)
      window.addEventListener('unload', this.handleUnload)
      window.addEventListener('click', this.watchScreenActive)
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.handleBeforeUnload)
      window.removeEventListener('click', this.watchScreenActive)
      window.removeEventListener('unload', this.handleUnload)
    },
    methods: {
      handleBeforeUnload() {
        this.beforeTime = new Date().getTime()
      },
      //关闭标签退出登陆态  刷新不退出登陆态
      handleUnload() {
        let _gap_time = new Date().getTime() - this.beforeTime
        if (_gap_time <= 5) {
          localStorage.removeItem('admin-pro-token')
        }
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
