<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      window.addEventListener('beforeunload', this.handleBeforeUnload)
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.handleBeforeUnload)
    },
    methods: {
      handleBeforeUnload() {
        localStorage.removeItem('admin-pro-token')
      },
    },
  }
</script>
