<template>
  <div>
    <x-header slot="header"
              class="top-tit"
              :title="title"
              :left-options ="leftoptions"             
    >
    </x-header>
    <div class="wrong404">
      <div class="wrong404-img"></div>
      <p>抱歉！該页已删除或不存在</p>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
export default {
  name: 'Page404',
  components: { XHeader },
  data () {
    return {
      sharePopupShow: false,
      leftoptions: {
        backText: ''
      },
      title: '错误'
    }
  }
}
</script>

<style lang="less" scoped>  
 @import '../../styles/app-theme.less';
  .top-tit{
    width:100%;position:absolute;left:0;top:0;z-index:100;
  }
  .wrong404{
    padding-top: 160px;
    line-height: 96px;
    font-size: 16px;
    text-align: center;
    .wrong404-img{  
      width: 280px;
      height: 190px; 
      margin: 0 auto;
      background-size:100% 100%;
    }
  }

</style>
