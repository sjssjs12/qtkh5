<template>
  <div v-transfer-dom>
    <alert v-model="showAlert" @on-show="onShow" @on-hide="onHide"> Your Message is sent successfully</alert>
  </div>
</template>

<script>
  import { Alert, TransferDom } from 'vux'
  export default {
    name: 'MyAlert',
    directives: {
      TransferDom
    },
    data () {
      return {
        showAlert: true
      }
    },
    components: {
      Alert
    },
    methods: {
      onHide () {
        console.log('on hide')
      },
      onShow () {
        console.log('on show')
      }
    }
  }
</script>

<style scoped>

</style>
