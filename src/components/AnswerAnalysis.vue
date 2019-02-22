<template>
    <div class="answerAnalysis-box answerAnalysis-box2">
        <div class="answerAnalysis-content">
            <h2><span></span>解析:</h2>
          <div v-html="qdata.Analysis"></div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'AnswerAnalysis',
    props: ['qdata']
  }
</script>


<style lang="less" scoped>
  .answerAnalysis-box{
    position: relative;
    background: #eee;
    &:before{
      position: absolute;
      content: '';
      border-top: 9px solid #fff;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid transparent;
      left: 50%;
      margin-left: -9px;
      top:0px;
    }
    h2{
      position: relative;
      color: #222222;
      font-size:16px;
      height: 18px;
      line-height: 18px;
      font-weight: normal;
      margin: 0 0 5px;
      padding-top: 10px;
      span{
        display: inline-block;
        line-height: 20px;
        height: 20px;
        padding-left: 3px;
      }
      &:before{
        position: absolute;
        top: 10px;
        content: '';
        left: 0;
      }
    }
  }
  .answerAnalysis-content {
    div{
      padding: 5px 10px;
      font-size: 15px;
    }
  }
  .answerAnalysis-box2:before{
    border-top: 9px solid #eee;
  }
 .ObtainMaterial {
    .answerAnalysis-box{
      background: #eee;
      &:before{
        border-top: 9px solid #f4f4f4;
      }
    }
    .answerAnalysis-box:before{
      border-top: 9px solid #eee;
    }
  }
</style>
