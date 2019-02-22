<template>
  <div class="share-content">
    <div class="references" v-html="qdata.References">
    </div>
    <template v-for="stem in qdata.Stems">
        <question-stem :stem="stem" :key="stem.Index + 'stem' " :hideBtnTemplate="true" :showAnswer="showAnswerIndexs.indexOf(stem.Index) > -1" seldisabled="true" @goto-next-slide="gotoNextSlide"></question-stem>
        <template v-if="showAnswerIndexs.indexOf(stem.Index) === -1">
          <x-button  :key="stem.Index"  v-if="stem.Options.length !== 0" @click.native="showAnswer(stem.Index)" class="sureButton">查看答案解析</x-button>
        </template>
    </template>
    <div v-if="showQuestinoAnalysis">
      <answer-analysis :qdata="qdata"></answer-analysis>
    </div>
    <a  :href="checkPlatform" class="weui-btn weui-btn_primary">{{showappname}}</a>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Checker, CheckerItem, querystring } from 'vux'
  import qktutils from '../../js/qtkutils'
  import QuestionStem from '../../components/QuestionStem'
  import AnswerAnalysis from '../../components/AnswerAnalysis'
  import questionApi from '@/api/question.js'
  export default {
    name: 'SharePage',
    components: {AnswerAnalysis, QuestionStem, Checker, CheckerItem},
    data () {
      return {
        showbtnclass: true,
        stemAnswer: '',
        showAnswerIndexs: [],
        qdata: {
          References: '',
          Stems: []
        }
      }
    },
    computed: {
      ...mapGetters('uiModule', ['appSkin']),
      isSingle () {
        return false
      },
      isSubjective () {
        // 是否是主观题
        return false
      },
      checkertype () {
        if (this.isSingle) {
          return 'radio'
        } else {
          return 'checkbox'
        }
      },
      defaultitemclass () {
        if (this.isSingle) {
          return 'demo1-item'
        } else {
          return 'demo1-item many-demo1-item'
        }
      },
      showQuestinoAnalysis () {
        console.log(this.qdata.Stems)
        return this.qdata.Stems.filter(e => e.Options.length !== 0).length === this.showAnswerIndexs.length
      },
      showappname () {
        if (this.appSkin === 'yikao') {
          return '下载文都医考APP'
        } else {
          return '下载文都考研APP'
        }
      },
      // 判断苹果还是安卓
      checkPlatform () {
        if (/android/i.test(navigator.userAgent)) {
          if (this.appSkin === 'yikao') {
            return 'http://m.wenduedu.com/default/down?type=wdyk'
          } else {
            return 'http://m.wenduedu.com/default/down?type=kytk'
          // console.log ("This is Android'browser.") // 这是Android平台下浏览器
          }
        }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          if (this.appSkin === 'yikao') {
            return 'https://itunes.apple.com/cn/app/id1158818559'
          } else {
            return 'https://itunes.apple.com/cn/app/id1266290282'
          // console.log("This is iOS'browser.") //   这是iOS平台下浏览器
          }
        }
      }
    },
    methods: {
      ...mapActions('uiModule', ['setShowUserAnswerText']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        let params = querystring.parse()
        let qid = 70369
        if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
          let QID = qktutils.Encrypt(qid)
        // 如果params是空，则造点假数据
          params = {
            s: QID,
            skin: 'yikao'
          }
        }
        qid = qktutils.Decrypt(params.s)
        questionApi.questionInfo(qid)
        .then((data) => {
          this.qdata = data
          this.$vux.loading.hide()
        })
      },
      gotoNextSlide () {
        return false
      },
      clickMe () {
        return false
      },
      stemComplete () {
        return false
      },
      nextStem () {
        return false
      },
      showAnswer (i) {
        if (this.showAnswerIndexs.indexOf(i) === -1) {
          this.showAnswerIndexs.push(i)
        }
      }
    },
    created () {
      this.getDataFromSrv()
      // 不显示 正确 错误的字符
      this.setShowUserAnswerText(false)
    }
  }
</script>

<style lang="less" scoped>
  .stem-question {
    border-top: 1px solid #eee;
    margin-top: 10px;
    padding-top: 10px;
    color: #333;
    font-size: 15px;
    video{
      width: 100% ;
      height: auto;
    }
    audio{
      width: 100% ;
      height: auto;
    }
  }
  .references {
    min-height: 10px;
    padding: 0 15px 0px;
    color: #666;
    font-size: 15px;
  }
  .share-content {
    background-color: #fff;
    padding-bottom: 60px;
    width: 100%;
    a.weui-btn_primary{
      width: 100%;
      text-align:center;
    }
    .sureButton{
      width: 40%;
      border-radius: 20px;
      color:#fff;
      line-height: 34px;
    }
  }
  .vux-checker-item{
    display: block!important;
  }
</style>