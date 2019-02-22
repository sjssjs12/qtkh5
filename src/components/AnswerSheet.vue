<template>
  <div class="questionpagebg">
    <x-header slot="header"
              class="top-header"
              title="答题卡"
              :left-options ="leftoptions"
              @on-click-back="goQuestion"
    >
    </x-header>
    <group class="groupTitle">
      <cell :title="headerConf.subTitle" ></cell>
    </group>
    <question-tabber v-show="false"></question-tabber>

    <div class="sheetitemdiv">
      <!--<practice-report v-show="!handover"></practice-report>-->
      <div v-for="b in examSection" :key="b.SectionId" class="clearfix">
        <p class="change-title">{{b.Title}}</p>
          <template v-for="a in answerSheet.SheetItems.filter(e => b.QuestionIds.indexOf(e.QID) > -1)">
            <router-link class="answerCode" :key="a.Inx" :to="{ name: 'QuestionPage', query: { inx:a.Inx, qid: a.QID, qinx: a.QInx}}" selected-item-class :value="a.Inx">
                <div class="q_item_1">
                  <div class="zm">
                    {{a.Inx+1}}
                    <span :class="btnClass(a)">{{a.Inx+1}}</span>
                  </div>
                  <!-- <span v-if="a.Inx == curStemGindex " class="span-active">{{a.Inx+1}}</span> -->
                </div>
            </router-link>
          </template>
      </div>
    </div>
    <!-- tabber end -->
    <div class="sub-answer" v-if="!this.showAnalysis">
      <x-button @click.native="submit" type="primary" >交卷并查看结果</x-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import QuestionTabber from './QuestionTabber' // 导入tabber组件
  import PracticeReport from './PracticeReport'// 导入练习chart组件
  import { Checker, CheckerItem, XHeader } from 'vux'
  import examAPI from '@/api/exam.js'
  export default {
    name: 'AnswerSheet',
    // props: ['stem', 'qdata'],
    components: {
      XHeader,
      Checker,
      CheckerItem,
      QuestionTabber,  // 注册tabber组件
      PracticeReport   // 注册练习chart组件
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
      ...mapGetters('uiModule', ['headerConf', 'showAnalysis', 'appSkin']),
      ...mapGetters('qModule', ['examSection', 'ticker', 'examInfo', 'baseInfo',
        'answerSheet', 'curStemGindex', 'curQuestionID'])
    },
    methods: {
      ...mapActions([]),
      ...mapActions('uiModule', ['setSubTitle', 'setShowAnalysis']),
      btnClass (answer) {
        if (answer.IsS) {
          return 'span-activeThree'
        } else if (!answer.IsD) {
          return 'span-gray'
        } else if (answer.IsD) {
          if (this.showAnalysis) {
            if (answer.IsC) {
              return 'span-green'
            } else {
              return 'span-red'
            }
          }
          return 'span-activeTwo'
        }
      },
      submit () {
        let _this = this
        let complete = this.answerSheet.SheetItems.filter(e => !e.IsD).length === 0
        // let answerstatus = 0  // 进行中
        let msg = '还有题目未做完，确定交卷吗？'
        if (complete) {
          // answerstatus = 1 // 已完成
          msg = '答题完毕，确定交卷吗？'
        }
        this.$vux.confirm.show({
          title: '温馨提示 ',
          content: '<p class="tip-sure">' + msg + '</p>',
          onCancel () {
          },
          onConfirm () {
            _this.doPost()
          }
        })
      },
      doPost () {
        this.handover = !this.handover
        this.setShowAnalysis(true)
        // 答完了，可以提交到服务器了
        console.log('打完了，可以提交到服务器了')
        if (!process.env.HTML_Debug) {
          this.$vux.loading.show({
            text: '加载中'
          })
          examAPI.submitAnswerSheet(this.answerSheet.ExamRecordID, this.ticker, 1, JSON.stringify(this.answerSheet.SheetItems), this.baseInfo.productid, this.baseInfo.examid, this.baseInfo.userid, this.curQuestionID).then((data) => {
            this.$vux.loading.hide()
            window.location.href = process.env.H5_HOST + 'Exam/ReportInfo?fr=ReportPage&skin=' + this.appSkin + '&userid=' + this.baseInfo.userid + '&examid=' + this.baseInfo.examid + '&productid=' + this.baseInfo.productid + '&examrecordid=' + data.obj // 跨页面跳转
            // if (!process.env.HTML_Debug) {
            // } else {
            // }
            // window.location.href = '/report.html?fr=ReportPage&userid=' + this.baseInfo.userid + '&examid=' + this.baseInfo.examid + '&productid=' + this.baseInfo.productid + '&examrecordid=' + data.obj  // 跨页面跳转
          })
        } else {
          this.$router.push({name: 'ReportPage'})
        }
      },
      goQuestion () {
        this.$router.push({name: 'QuestionPage', query: {inx: this.curStemGindex}})
      }
    },
    mounted () {
    },
    created () {
      // 设置副标题
      // this.setSubTitle(this.examInfo.ExamName)
      // this.setSubTitle('我的主标题我的主标题')
    }
  }
</script>
<style scoped lang="less">
  .top-header{
      width:100%;
      position:absolute;
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
    height:44px;
    line-height: 44px;
    overflow: hidden;
    font-size: 15px;
    color: #666;
    z-index: 100;
    div.weui-cell{
      padding:0 5px;
      background: #f4f4f4;
    }
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
    margin-top: 98px;
  }
</style>
