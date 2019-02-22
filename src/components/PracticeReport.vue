<template>
  <div class="practiceReport">
    <x-header ref="topheader"
              slot="header"
              class="top-header"
              :title="headerConf.title"
              :left-options ="leftoptions"
              @on-click-back="exitH5">
    </x-header>
    <div class="practice-detail">
      <h2 class="title">{{headerConf.subTitle}}</h2>
      <p class="build-time">生成时间：{{this.examRecord.FinishedDate}}</p>
      <div class="circle">
        <x-circle :percent="percent" :stroke-width="3" :stroke-color="strokecolor" trail-color="#e7e1fc">
          <span :style="{color:strokecolor}"><i>{{ percent }}</i>%</span>
          <p :style="{color:strokecolor}">{{answerRight}}</p>
        </x-circle>
      </div>
      <p class="user-time">练习用时：{{this.examRecord.ElapsedMinutes}}</p>
      <p class="accuracy" @click="accuracyAlert">正确率？</p>
    </div>
    
    <div v-for="b in examSection" class="clearfix" :key="b.SectionId" >
      <p class="change-title">{{b.Title}}</p>
      <div v-for="a in answerSheet.SheetItems.filter(e => b.QuestionIds.indexOf(e.QID) > -1)" :key="a.Inx">
        <a class="answerCode" >
          <div class="q_item_1">
            <div class="zm">
              {{a.Inx+1}}
              <span :class="btnClass(a)">{{a.Inx+1}}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="sub-answer">
      <a :href="linkurl" >
        <x-button  type="primary" >查看解析</x-button>
      </a>
    </div>
  </div>
</template>

<script>
  import { XHeader, XCircle, Range, Icon, AlertModule, Alert } from 'vux'
  import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'PracticeReport',
    components: {
      XHeader,
      AlertModule,
      Alert,
      XCircle,
      Range,
      Icon
    },
    data () {
      return {
        toptitle: '练习报告',
        title: '练习报告',
        timer: null,
        answerRight: '正确率',
        userTime: 0,
        entryUrl: document.location.href,
        leftoptions: {
          backText: '',
          preventGoBack: true  // 为true时点击【返回】触发@on-click-back，默认为true，为false时根据router返回
        }
      }
    },
    computed: {
      ...mapGetters('uiModule', ['headerConf', 'appSkin']),
      ...mapGetters('qModule', ['examSection', 'examRecord', 'baseInfo', 'answerSheet', 'curStemGindex']),
      isShowNav () {
        if (this.entryUrl.indexOf('hide-nav') > -1) {
          return false
        }
        return true
      },
      percent () {
        return this.examRecord.Correct
        // this.examRecord.Correct
      },
      strokecolor () {
        if (this.percent >= 80) {
          return '#34D190'
        } else if (this.percent >= 70) {
          return '#95DD23'
        } else if (this.percent >= 60) {
          return '#EAA31A'
        } else {
          return '#F15F5F'
        }
      },
      linkurl () {
        let url = ''
        if (!process.env.HTML_Debug) {
          url = '/Exam/ReportInfo'
          let oldurl = 'Exam/ReportInfo'
          url += '?examrecordid=' + this.examRecord.ExamRecordID + '&productid=' + this.baseInfo.productid + '&userid=' +
          this.baseInfo.userid + '&examid=' + this.baseInfo.examid + '&oldurl=' + oldurl + '&fr=Analysis&skin=' + this.appSkin
        }
        return url
      }
    },
    methods: {
      ...mapActions('qModule', ['setAnswerSheet', 'setQuestionIndexs']),
      btnClass (answer) {
        if (answer.IsS) {
          return 'span-activeThree'
        } else if (!answer.IsD) {
          return 'span-gray'
        } else if (answer.IsD) {
          if (answer.IsC) {
            return 'span-green'
          } else {
            return 'span-red'
          }
        }
      },
      accuracyAlert () {
        AlertModule.show({
          title: '',
          content: '正确率=客观题正确量/客观题数量',
          buttonText: '知道了 ',
          onShow () {
            console.log('Module: I\'m showing')
          },
          onHide () {
            console.log('Module: I\'m hiding now')
          }
        })
      },
      exitH5 () {
        console.log('退出页面')
        this.$vux.confirm.show({
          // 组件除show外的属性
          title: '温馨提示',
          content: '是否确定离开',
          onConfirm () {
            console.log('要退出了，得调用js桥回到原生应用里了')
            if (window.jsbridge) {
              window.jsbridge.exitWebView()
            }
            if (window.webkit) {
              window.webkit.messageHandlers.exitWebView.postMessage('')
            }
          }
        })
      }
    },
    created () {
      // 给原生调用的方法
      window.winfun_exit = this.exitH5
    },
    mounted () {
    }
  }
</script>

<style lang="less" scoped>
  .top-header{
      width:100%;
      position:absolute;
      left:0;
      top:0;
      z-index:100;
  }
  .title{
    margin-top: -42px;
    font-size: 16px;
    color: #333333;
  }
  .circle {
    width: 100px;
    height: 100px;
    margin: 10px auto 0;
    span{
      font-size: 16px;
      i{
        font-size: 28px;
        font-style: inherit;
      }
    }
    p{
      font-size: 12px;
    }
  }
  .build-time {
    color: #aaa;
    font-size: 12px;
  }
  .user-time {
    color: #999999;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
  }
  .computed{
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #aaa;
  }
  .accuracy{
    color: #999999;
    font-size: 12px;
    text-align: right;
    line-height: 30px;
  }

  .practice-detail{
    margin-top: 98px;
    padding: 0 15px 5px;
    border-bottom: 8px solid #f4f4f4;
    h2{
      font-size: 16px;
      color: #333333;
      font-weight: normal;
    }
  }
  .weui-dialog__bd > div{
    color: #666
    }
  .change-title{
    line-height: 48px;
    color: #666666;
    font-size: 14px;
    padding-left: 15px;
    }
  .answerCode{
    display: block;
  }
  // .span-active{
  //   width: 48px;
  //   height: 48px;
  //   line-height: 47px;
  //   color: #fff;
  //   border-radius: 50%;
  //   position: absolute;
  //   top: 0;
  //   left: 50%;
  //   margin-left: -24px;
  //   z-index: 50;
  //   display: none;
  // }
  .span-activeTwo, .span-activeThree, .span-gray,.span-red, .span-green{
    width: 46px;
    height: 46px;
    line-height: 46px;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    top: -1px;
    left: -1px;
    
  }
  .span-activeThree{
    border:1px solid #ccc;
    color: #ccc;
    z-index: 50;
  }
  .span-gray{
    border:1px solid #cccccc;
    color: #999;
    z-index: 51;
  }
  .span-activeTwo{
    z-index: 52;
  }
  .span-red{
    z-index: 53;
    background: #f15f5f;
    border:1px solid #f15f5f;
  }
  .span-green{
    z-index: 54;
    background: #48c867;
    border:1px solid #48c867;
  }
 
  .demo1-item-disabled {
    color: #ccc;
  }
  .q_item_1{
    width: 20%;
    height: 100%;
    margin-top: 2%;
    line-height: 100%;
    font-size: 20px;
    text-align: center;
    position: relative;
    float: left;
    &:last-child{
      margin-right: 0;
    }
  }
  .zm{
    width: 46px;
    height: 46px;
    line-height:46px;
    margin: 0 auto 10px;
    border-radius: 50%;
    color: #999;
    border: 1px solid #999999;
    font-size: 20px;
    position: relative;
  }
  .q_item_2{
    width: 90%;
    border-bottom: 1px solid #eaeaea;
    line-height: 48px;
    font-size: 15px;
    float: left;
  }
  .demo1-item .q_item_2:last-child{
    border-bottom: none;
  }
  .demo1-item-selected .q_item_1 .zm{
    color: #fff;
  }
  .sub-answer{
    margin-top: 50px;
    .weui-btn_primary{
      height: 50px;
      line-height: 50px;
      margin-top: 15px;
      background: #fff;
      border: 0;
      border-top: 1px solid #f4f4f4;
      box-shadow: 0px 1px 0px rgba(0,0,0,0.2);
      border-radius: 0!important;
      position: absolute;
      z-index: 999;
      bottom: 0;
    }
    .weui-btn:after{
      border-radius: 0;
      border: 0
    }
  }
</style>

