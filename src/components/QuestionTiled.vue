<template>
  <div>
    <x-header slot="header"
              class="note-header"
              :title="headerConf.title"
              :left-options ="leftoptions"
              @on-click-back="exitH5"
    > <a slot="right" @click="sharePopupShow = true" ><img src="../images/nav_share.png"/></a>
    </x-header>
    <!-- 分享弹出层 -->
    <share-popup :popup-show="sharePopupShow" :qid="qdata.QuestionID"  @close="closeSharePopup"></share-popup>
    <!-- 分享弹出层 end -->
    <div class="tiled-wrap">
      <div class="references" v-html="qdata.References"></div>
      <template v-for="stem in qdata.Stems">
        <question-stem :stem="stem" :hideBtnTemplate="true" :key="stem.Index" ref="questionstems" seldisabled="true"></question-stem>
      </template> 
      <answer-analysis :qdata="qdata"></answer-analysis>
      <note-edit :qdata="qdata"></note-edit>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { XHeader } from 'vux'
  import QuestionStem from './QuestionStem'
  import AnswerAnalysis from './AnswerAnalysis'
  import NoteEdit from './NoteEdit'
  import SharePopup from './SharePopup'
  export default {
    name: 'QuestionTiled',
    directives: {},
    components: {
      AnswerAnalysis,
      QuestionStem,
      XHeader,
      NoteEdit,
      SharePopup // 分享面板
    },
    data () {
      return {
        sharePopupShow: false,
        leftoptions: {
          backText: '',
          preventGoBack: true  // 为true时点击【返回】触发@on-click-back，默认为true，为false时根据router返回
        }
      }
    },
    computed: {
      ...mapGetters('uiModule', ['headerConf', 'showAnalysis']),
      ...mapGetters('qModule', ['dbQuestions', 'answerSheet', 'questionIndexs', 'baseInfo']),
      qdata () {
        if (this.dbQuestions.length > 0) {
          console.log(this.dbQuestions[0].Stems)
          return this.dbQuestions[0]
        } else {
          return {
            QuestionID: 0,
            References: '',
            Stems: []
          }
        }
      },
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
      }
    },
    methods: {
      ...mapActions('qModule', ['setDoRefreshNote']),
      // dealRouterParam () {
      //   // 获取传来的索引值
      //   let inx = this.$route.query.inx
      //   let qid = this.$route.query.qid
      //   let qinx = this.$route.query.qinx
      //   if (inx || (qid && qinx)) {
      //     if (inx) {
      //       this.setCurStemGindex(inx)
      //     } else if (qid && qinx) {
      //       this.setCurStemGindex({QID: qid, QInx: qinx})
      //     }
      //   } else {
      //     this.setCurStemGindex(0)
      //   }
      // },
      exitH5 () {
        let content = '是否确定离开，并保存作答记录'
        if (this.showAnalysis) {
          content = '是否确定离开'
        }
        this.$vux.confirm.show({
          // 组件除show外的属性
          title: '温馨提示',
          content: content,
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
      },
      closeSharePopup (code, msg) {
        if (window.jsbridge && process.env.APP_Debug) {
          // window.jsbridge.toast(msg)
        }
        this.sharePopupShow = false
      },
      bindAnswer () {
        if (this.$refs.questionstems && this.$refs.questionstems.length > 0) {
          this.$refs.questionstems.forEach(e => {
            e.bindAnswer()
          })
        }
      },
      refreshnote () {
        this.setDoRefreshNote(1)
      }
    },
    created () {
      // 给原生调用的方法
      window.winfun_exit = this.exitH5
      // 刷新笔记
      window.winfun_refreshnote = this.refreshnote
    },
    mounted () {
      this.bindAnswer()
    }
  }
</script>

<style lang="less" scoped>
  .note-header{
    width:100%;
    position:absolute;
    left:0;
    top:0;
    z-index:100;
  }
  .vux-header-right a img{
    display: block;
    width: 60%;
    float: right;
    }  
  .tiled-wrap{
    padding-bottom: 10px;
    padding-top: 46px;
  }
  .demo1-item {
    margin-top: 3%;
    display: block;
}
  .references {
    min-height: 10px;
    padding: 10px 15px 10px;
    color: #666;
    font-size: 15px;
  }
  .vux-header-right a img{
    width: 33%!important;
  }
</style>