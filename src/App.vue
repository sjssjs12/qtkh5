<template>
  <div>
    <router-view></router-view>
    <lstorage></lstorage>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { querystring } from 'vux'
import Lstorage from '@/components/Lstorage'
export default {
  name: 'App',
  components: {Lstorage},
  data () {
    return {}
  },
  computed: {
    ...mapGetters('uiModule', ['appSkin'])
  },
  methods: {
    ...mapActions('uiModule', ['setAppSkin']),
    useSkin () {
      document.getElementsByTagName('body')[0].className = this.appSkin
    }
  },
  watch: {
    appSkin () {
      this.useSkin()
    }
  },
  created () {
    let params = querystring.parse()
    if (params.fr) {
      this.$router.push({name: params.fr})
    } else {
      // 默认去试卷答题页面
      // this.$router.push({name: 'Home'})
    }
    if (params.skin) {
      this.setAppSkin(params.skin)
    }
  },
  mounted () {
    this.useSkin()
      // this.$router.push({name: 'ExamQuestion'})
  }
}
</script>

<style lang="less"> 
@import '~vux/src/styles/reset.less';
  body {
    background-color: #fff;
  }
  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  img {
    display: block;
    width: 100%;
  }
  .clearfix:after { content:"."; display:block; height:0; visibility:hidden; clear:both; }
  .clearfix { zoom:1; }
  img {
    display: block;
    width: 100%;
  }
  .weui-dialog__bd .tip-qing{
    color: #333;
    font-size: 18px;
  }
  .weui-dialog__bd .tip-over{
    color: #333;
    font-size: 14px;
  }
  /*groupTitle定义并去掉group跟框架重定义的样式代码*/
  .groupTitle{
    width: 100%;
    position: absolute;
    top: 46px;
    z-index: 99; 
  }
  .groupTitle p{
    color: #666;
    font-size: 16px;
    border: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .chapterbg .groupTitle p,.questionpagebg .groupTitle p{
    text-indent: 5px;
    background: #f4f4f4;
    line-height: 44px;
  }
  .groupTitle .vux-cell-primary{
    width: 80%;
  }

  .groupTitle .weui-cell__ft{
    color: #999;
    font-size: 14px;
  }  
  .groupTitle .weui-cells:before {
    border-top: none !important;
  }

  .weui-cells {
    margin-top: 0 !important;
    }
  .weui-dialog__bd>div{
    line-height: 40px;
  }
  .accordion-cont .feed-back .weui-cells{
    background: #fff;
  }
  .ObtainMaterial .feed-back .weui-cells{
    background: #eee;
  }
  .accordion-cont .demo1-item .q_item_2{
    border-bottom:none!important;
  }
  .ObtainMaterial .demo1-item:last-child .q_item_2{
    border:none;
  }
  .sureButton{
    width: 40%;
    margin: 15px auto 0;
    line-height: 34px;
    border:none;
    border-radius: 20px;
    font-size: 18px;
    color: #fff;
    outline: none;
    display: block;
  }
  .sub-answer, .share-content{
    margin-top: 50px;
    .weui-btn_primary{
      background: #fff;
      height: 50px;
      line-height: 50px;
      margin-top: 15px;
      position: fixed;
      z-index: 999;
      bottom: 0;
      border: 0;
      border-top: 1px solid #f4f4f4;
      box-shadow: 0px 1px 0px rgba(0,0,0,0.2);
      border-radius: 0!important;
    }
    .weui-btn_primary:active{
      background: #fff!important;
    }
    .weui-btn:after{
      border-radius: 0;
      border: 0
    }
  }
  .vux-popup-right{
    -webkit-transition-property: -webkit-transform;
    transition-property: -webkit-transform;
    transition-property: transform;
    transition-property: transform, -webkit-transform;
    -webkit-transition-duration: 0ms!important;
    transition-duration: 0ms!important;
  }
  .apptheme(@primary-color:#8168ed,@page-404-bg:'./images/404.png',@accordion-btn-bg:'./images/accordion-btn.png',@like-bg:'./images/like.png',@like-h-bg:'./images/like-h.png') {
    .vux-header {
      background-color: @primary-color;
    }
    .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
      color: @primary-color!important; ;
    }
    .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
      color: @primary-color!important; ;
    }
     .vux-label {
      color: @primary-color;
    }
    .answerAnalysis-box{
      span{
        border-left: 3px solid @primary-color;
      }
      // &:before{
      //   border-left: 5px solid @primary-color;
      // }
    }
    .span-activeTwo{
      background: @primary-color;
      border:1px solid @primary-color;
    }
    .demo1-item-selected .q_item_1 .zm{
      background: @primary-color;
      border: 1px solid @primary-color;
    }
    .sub-answer, .share-content{
      .weui-btn_primary{
        color: @primary-color;
      }
    }
    .currentNum {
      color: @primary-color;
    }
    .toggleColor{
      color: @primary-color!important;
    }
    .sureButton{
      background: @primary-color;
    }
    .answerAnalysis-content {
      div{
        ol,ul{
        padding-left: 18px;
        }
      }
      i.i-color3{
        color: @primary-color;
      }
    }
    .weui-dialog__btn_primary,.weui-dialog__btn_default{
      color: @primary-color;
    }
    .item-tabber-label-color{
       color: @primary-color!important;
    }
    .weui-btn_primary:active{
       color: @primary-color!important;
    }
    .accordion-btn-group{
      a{
        background-image: url('@{accordion-btn-bg}');
      }
    }
    .wrong404{
      color: @primary-color; 
    }
    .wrong404-img{
      background-image: url('@{page-404-bg}');
    }
    .item-tabber-icon {
      b.like{
        background-image: url('@{like-bg}');
      }
      b.like-h{
        background-image: url('@{like-h-bg}');
      }
    }
  }
  .kaoyan {
    .apptheme()
  }
  .yikao {
    .apptheme(#00c8b3,'./images/404-yk.png','./images/accordion-btn-yk.png','./images/like-yk.png','./images/like-h-yk.png')
  }
</style>
