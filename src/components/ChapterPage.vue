<template>
  <div>
    <x-header slot="header"
              class="top-header"
              :title="headerConf.title"
              :left-options ="leftoptions"
              @on-click-back="exitH5"
    > <a slot="right" @click="sharePopupShow = true" ><img src="../images/nav_share.png"/></a>
    </x-header>
    <!-- 分享弹出层 -->
    <share-popup :popup-show="sharePopupShow" :qid="curQuestionID"  @close="closeSharePopup"></share-popup>
    <!-- 分享弹出层 end -->   
    <group class="groupTitle">
      <cell :title="headerConf.subTitle" value="value"><span class="currentNum">{{curGlobalIndex}}</span>/{{stemTotal}}</cell>
    </group>

    <!-- 试题 slide  start-->
    <div class="mySwiper-wrap">
      <div>
        <swiper class="mySwiper"  :options="swiperOption" ref="mySwiper" >
        <!-- slides -->
          <template v-for="q in PageQuestions">
            <swiper-slide :data-qid="q" :key="q.QuestionID">
              <question :qid="q" @stem-index-change="stemIndexChange" ref="questions" @goto-next-slide="gotoNextSlide"></question>
            </swiper-slide>
          </template>
          <div :style="{height:PropHeight+'px'}" v-if="PageQuestions.length === 1"></div>
        <!-- slides end-->
        </swiper>
      </div>
    </div>
    <!--  试题 slide end-->
    <!-- tabber start -->
    <chapter-tabber ref="tabber" @show-answer-sheet="showAnswerSheetPanel = true"></chapter-tabber>
    <div v-transfer-dom>
      <popup v-model="showAnswerSheetPanel" hight="100%" position="right" width="100%">
        <chapter-answerSheet @go-question-stem="goQuestionStem" @close="closeAnswerSheetPanel"></chapter-answerSheet>
      </popup>
    </div>
    <!-- tabber end -->
  </div>
</template>

<script>
import { XHeader, TransferDom, Popup } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Question from './Question'
import QuestionStem from './QuestionStem' // 导入题干组件
import ChapterTabber from './ChapterTabber' // 导入tabber组件
import ChapterAnswerSheet from './ChapterAnswerSheet'
import SharePopup from './SharePopup'
export default {
  name: 'ChapterPage',
  directives: {
    TransferDom
  },
  props: [],
  components: {
    swiper,
    swiperSlide,
    XHeader,
    Question,
    QuestionStem, // 注册题干组件
    ChapterTabber, // 注册tabber组件
    ChapterAnswerSheet,
    SharePopup, // 分享面板
    Popup
  },
  data () {
    let app = this
    return {
      PropHeight: document.documentElement.clientHeight - 153,
      sharePopupShow: false,
      showMenus: false,
      isPadding: false,
      showAnswerSheetPanel: false,
      RouteIn: false, //  是否通过路由进来
      leftoptions: {
        backText: '',
        preventGoBack: true // 为true时点击【返回】触发@on-click-back，默认为true，为false时根据router返回
      },
      swiperOption: {
        speed: 200,
        on: {
          init () {},
          touchEnd () {
            let TR = this.translate
            if (TR < -1 * this.width * (this.slides.length - 1) - 80) {
              app.slideEnd()
            } else if (TR >= 0) {
              app.slideStart()
            } else {
              console.log('touch end' + this.activeIndex)
            }
          },
          slideChange () {},
          slideChangeTransitionStart () {
            app.$refs.questions[this.previousIndex].hideStem()
          },
          slideResetTransitionEnd () {
            let questionID = this.slides.eq(this.activeIndex).data('qid')
            console.log(
              `slideResetTransitionEnd,qid:${questionID},activeIndex:${
                this.activeIndex
              },previousIndex:${this.previousIndex}`
            )
          },
          slideChangeTransitionEnd () {
            // 正数 向右翻 负数向左翻
            let direction = this.activeIndex - this.previousIndex
            let questionID = this.slides.eq(this.activeIndex).data('qid')

            console.log(
              `slideChangeTransitionEnd,qid:${questionID},activeIndex:${this.activeIndex},previousIndex:${this.previousIndex}`
            )

            // 进行特殊处理
            // 如果到第3个slide,则试题开始索引+1
            if (this.activeIndex === 2) {
              app.setQuestionBeginIndex(app.questionBeginIndex + 1)
              this.activeIndex--
            } else if (this.activeIndex === 0 && app.questionBeginIndex > 0) {
              // 如果到第1个slide,则试题开始索引-1
              app.setQuestionBeginIndex(app.questionBeginIndex - 1)
              this.activeIndex++
            }
            // 特殊处理结束
            app.$nextTick(() => {
              if (app.RouteIn) {
                app.RouteIn = false
              } else {
                console.log(
              `slideChangeTransitionEnd1,qid:${questionID},activeIndex:${this.activeIndex},previousIndex:${this.previousIndex}`
                )
                // 如果是反方向且当前不是第1个题干
                if (direction < 0 && app.curStemGindex !== 0) {
                  let ainx = app.answerSheet.SheetItems.filter(e => e.QID + '' === questionID).length - 1
                  app.setCurStemGindex({ QID: questionID, QInx: ainx })
                }
                // 如果是正方向且当前不是最后一道试题
                if (direction > 0 && app.curQuestionID !== app.questionIndexs[app.questionIndexs.length - 1]) {
                  app.setCurStemGindex({ QID: questionID, QInx: 0 })
                  console.log(app.curQuestionID)
                  console.log(app.questionIndexs[app.questionIndexs.length - 1])
                }
              }
            })
          }
        }
      },
      boxShow: false
    }
  },
  computed: {
    ...mapGetters('uiModule', ['headerConf', 'showAnalysis']),
    ...mapGetters('qModule', ['gotoAnswerSheet', 'baseInfo', 'stemTotal', 'subjectInfo',
      'answerSheet', 'curStemGindex', 'questionIndexs', 'questionBeginIndex', 'curQuestionID']),
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    curGlobalIndex () {
      return parseInt(this.curStemGindex) + 1
    },
    PageQuestions () {
      let qs = this.questionIndexs.slice(
        this.questionBeginIndex,
        this.questionBeginIndex + 3
      ) // 每次只显示3个slide
      return qs
    },
    stemTotal () {
      return this.answerSheet.SheetItems.length
    }
  },
  methods: {
    ...mapActions('uiModule', ['setTitle', 'setSubTitle']),
    ...mapActions('qModule', ['setDoRefreshNote', 'setAnswerSheet', 'setCurStemGindex', 'setQuestionIndexs',
      'setQuestionBeginIndex']),
    closeAnswerSheetPanel () {
      this.showAnswerSheetPanel = false
    },
    stemIndexChange (questionID, stemindex) {
      console.log('stem index change ' + stemindex)
      // 设置当前题干索引
      this.setCurStemGindex({ QID: questionID, QInx: stemindex })
      console.log(`${questionID}-${stemindex}`)
    },
    gotoNextSlide () {
      if (this.swiper.isEnd) {
        this.slideEnd()
      } else {
        this.swiper.slideNext()
      }
    },
    slideEnd () {
      console.log('这是最后一题，该干点啥了')
      if (this.gotoAnswerSheet) {
        this.showAnswerSheetPanel = true
        // this.$router.push({ name: 'answersheet' })
      }
    },
    slideStart () {
      console.log('这已经是第一题了')
    },
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
    refreshnote () {
      this.setDoRefreshNote(1)
    },
    dealRouterParam () {
        // 获取传来的索引值
      let inx = this.$route.query.inx
      let qid = this.$route.query.qid
      let qinx = this.$route.query.qinx
      if (inx || (qid !== undefined && qinx !== undefined)) {
        if (inx) {
          this.setCurStemGindex(inx)
        } else if (qid !== undefined && qinx !== undefined) {
          this.setCurStemGindex({ QID: qid, QInx: qinx })
        }
      } else {
        this.setCurStemGindex(0)
      }
    },
    goQuestionStem () {
      console.log('diyiticeshi')
      console.log(this.curQuestionID)
      this.showAnswerSheetPanel = false
      let beginIndex = 0
      var qustionindex = this.questionIndexs.indexOf(this.curQuestionID)
      if (qustionindex > 0) {
        beginIndex = qustionindex - 1
      }
      this.setQuestionBeginIndex(beginIndex)
      this.$nextTick(() => {
        let distIndex = qustionindex - beginIndex
        if (this.swiper.activeIndex !== distIndex) {
          this.RouteIn = true
          this.swiper.slideTo(distIndex)
        } else {
          this.RouteIn = false
        }
        // 第一次 主动绑定是否收藏
        this.$refs.tabber.bindData()
      })
    }
  },
  created () {
    // 处理路由参数
    this.dealRouterParam()
    // 给原生调用的方法
    window.winfun_exit = this.exitH5
    // 关闭分享popup
    window.winfun_closeSharePopup = this.closeSharePopup
    // 刷新笔记
    window.winfun_refreshnote = this.refreshnote
  },
  mounted () {
    // 设置顶部标题
    // this.setTitle(this.subjectInfo.TypeName)
      // 设置副标题
    this.setSubTitle(this.subjectInfo.Name)
    // 去具体题干
    this.goQuestionStem()
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
.mySwiper {
  margin: 105px 0 0;
  color: #666666;
  font-size: 16px;
  line-height: 26px;
  .swiper-slide {
    word-break: break-all;
  }
}
.currentNum {
  font-size: 24px;
}
.mySwiper-wrap {
  position: absolute;
  top: 0;
  width: 100%;
}
.vux-header-right a img {
  display: block;
  width: 33%;
  float: right;
}
</style>
