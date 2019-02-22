<template>
  <div class="feed-wrap">
      <group class="feed-back">
          <cell :title="title" is-link @click.native="gotoAPP"></cell>
      </group>
  </div>
</template>

<script>
  export default {
    name: 'FeedBack',
    props: ['qdata'],
    components: {},
    data () {
      return {
        title: '试题纠错:'
      }
    },
    methods: {
      gotoAPP () {
        console.log('调用原生APP添加反馈,试题ID:' + this.qdata.QuestionID)
        if (window.jsbridge) {
          window.jsbridge.addFeedBack(this.qdata.QuestionID)
        }
        if (window.webkit) {
          window.webkit.messageHandlers.addFeedBack.postMessage(this.qdata.QuestionID)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .feed-wrap{
    padding-top:10px; 
    background: #eee;
  }
  .feed-back{
    .weui-cells {
      background: #fff;
      &:before{
        border-top:none;
      }
    }  
  }


</style>