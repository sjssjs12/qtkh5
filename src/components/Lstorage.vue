<template>
</template>
<script>
  import sdlocalstorage from '../js/sdlocalstorage'
  export default {
    mounted () {
      if (!sdlocalstorage.test()) {
        this.$vux.alert.show({
          title: '温馨提示',
          content: '该设备不支持localstorage'
        })
      }
    }
  }
</script>
