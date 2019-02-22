<template>
  <div class="chapterbg">
    <x-header slot="header"
              class="top-header"
              title="答题卡"
              :left-options ="leftoptions"
              @on-click-back="close"
    ><a slot="right" class="clearbtn" @click="emptydata">清空重做</a>
    </x-header>
    <group class="groupTitle">
      <cell :title="headerConf.subTitle"></cell>
    </group>
    <div class="sheetitemdiv">
      <div class="clearfix">
          <template v-for="a in answerSheet.SheetItems">
            <div class="answerCode" :key="a.Inx" @click="goanswersheet(a.Inx, a.QID, a.QInx)" selected-item-class :value="a.Inx">
                <div class="q_item_1">
                  <div class="zm">
                    {{a.Inx+1}}
                    <span :class="btnClass(a)">{{a.Inx+1}}</span>
                  </div>
                </div>
            </div>
          </template>
      </div>
    </div>
    <!-- tabber end -->
    <div class="sub-answer">
      <x-button @click.native="chapterGetData" type="primary" >作答完毕，再加一组</x-button>
    </div>
  </div>
</template>

<script>
  import answerSheetApi from '@/api/answersheet'
  import { mapGetters, mapActions } from 'vuex'
  import { Checker, CheckerItem, XHeader, AlertModule } from 'vux'
  import sdlocalstorage from '@/js/sdlocalstorage'
  export default {
    name: 'ChapterAnswerSheet',
    // props: ['stem', 'qdata'],
    components: {
      XHeader,
      Checker,
      CheckerItem,
      AlertModule
    },
    data () {
      return {
        toptitle: '答题卡',
        leftoptions: {
          backText: '',
          preventGoBack: true  // 为true时点击【返回】触发@on-click-back，默认为true，为false时根据router返回
        }
      }
    },
    computed: {
      ...mapGetters('uiModule', ['headerConf', 'showAnalysis']),
      ...mapGetters('qModule', ['examSection', 'ticker', 'examInfo', 'baseInfo',
        'answerSheet', 'curStemGindex', 'curQuestionID'])
    },
    methods: {
      ...mapActions('qModule', ['setCurStemGindex', 'addAnswerSheetStems', 'setAnswerSheetStems', 'setQuestionIndexs']),
      ...mapActions('uiModule', ['setSubTitle', 'setShowAnalysis']),
      emptydata () {
        let _this = this
        this.$vux.confirm.show({
          title: '重新做题会清空当前答题记录',
          content: '<p class="tip-qing">' + '是否清空并重新做题？' + '</p>',
          onCancel () {
          },
          onConfirm () {
            _this.resetdata()
          }
        })
      },
      resetdata () {
        this.setAnswerSheetStems([])
  
        if (process.env.USE_MOCK === true) {
          // 如果使用mock数据，则需要清除本地存储的试题数据
          sdlocalstorage.clearMine()
        }
        // 获取新一批数据
        this.$vux.loading.show({ text: '加载中' })
        answerSheetApi.getClear(this.baseInfo.productid, this.baseInfo.userid, this.baseInfo.subsubjectid).then(sheets => {
          if (sheets && sheets.length > 0) {
            // 添加到vuex
            this.addAnswerSheetStems(sheets)
            this.goanswersheet(0)
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
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
      close () {
        this.$emit('close')
      },
      chapterGetData () {
        let _this = this
        this.$vux.confirm.show({
          title: '作答完毕，确定再加一组吗？ ',
          content: '<p class="tip-sure">' + '新加试题题号自动累加到答题卡' + '</p>',
          onCancel () {
          },
          onConfirm () {
            _this.getchapterquestion()
          }
        })
      },
      getchapterquestion () {
        this.$vux.loading.show({ text: '加载中' })
        answerSheetApi.getGoAnotherQuestions(this.baseInfo.productid, this.baseInfo.userid, this.baseInfo.subsubjectid).then(sheets => {
          if (sheets.length > 0) {
            // 添加到vuex
            this.addAnswerSheetStems(sheets)
          } else {
            // this.$vux.confirm.show({
            //   // title: '温馨提示 ',
            //   content: '<p class="tip-sure">' + '出题完毕,本章节已无更多试题' + '</p>',
            //   buttonText: '知道了 ',
            //   onShow () {
            //     console.log('Module: I\'m showing')
            //   },
            //   onHide () {
            //     console.log('Module: I\'m hiding now')
            //   }
            // })
            AlertModule.show({
              title: '',
              content: '<p class="tip-over">' + '出题完毕,本章节已无更多试题' + '</p>',
              buttonText: '知道了 ',
              onShow () {
                console.log('Module: I\'m showing')
              },
              onHide () {
                console.log('Module: I\'m hiding now')
              }
            })
          }
        }).finally(() => {
          this.$vux.loading.hide()
        })
      },
      goanswersheet (inx, qid, qinx) {
        if (inx || (qid !== undefined && qinx !== undefined)) {
          if (inx) {
            this.setCurStemGindex(inx)
          } else if (qid !== undefined && qinx !== undefined) {
            this.setCurStemGindex({ QID: qid, QInx: qinx })
          }
        } else {
          this.setCurStemGindex(0)
        }
        this.$emit('go-question-stem')
      }
    },
    mounted () {
    },
    created () {
      // 设置副标题
      this.setSubTitle(this.examInfo.ExamName)
      // this.setSubTitle('我的主标题我的主标题')
    }
  }
</script>
<style scoped lang="less">
  .top-header{
      width:100%;
      position: fixed;
      left:0;
      top:0;
      z-index:100;
  }
  .groupTitle{
    position: fixed;
    top: 46px;
    left: 0;
    background: #f4f4f4;
    width: 100%;
    height: 44px;
    line-height: 44px;
    overflow: hidden;
    font-size: 15px;
    color: #666;
    z-index: 100;
    div{
      padding:0 5px;
      background: #f4f4f4;
    }   
  }
  .chapterbg{
    background: #fff;
    width: 100%;
    height: auto;
    float: left;
    min-height: 100%
    
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
    color: #999;
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
    position: relative;
    text-align: center;
    font-size: 20px;
    width: 20%;
    line-height: 100%;
    height: 100%;
    float: left;
    margin-top: 2%;
    &:last-child{
      margin-right: 0;
    }
  }
  .zm{
    border-radius: 50%;
    color: #999;
    border: 1px solid #999999;
    font-size: 20px;
    position: relative;
    width: 46px;
    height: 46px;
    line-height:46px;
    margin: 0 auto 10px;
  }
  .demo1-item-selected .q_item_1 .zm{
    color: #fff;
  }
  .sheetitemdiv{
    margin-top: 90px;
  }
  
  .vux-header-right .clearbtn{
    font-size: 16px;
    color: #fff;
  }
  .weui-dialog__bd .tip-sure{
    color: #333;
    font-size: 14px;
  }
</style>
