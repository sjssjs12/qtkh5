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
              <question :qid="q" @stem-index-change="stemIndexChange" @goto-next-slide="gotoNextSlide" ref="questions"></question>
            </swiper-slide>
          </template>
          <div :style="{height:PropHeight+'px'}" v-if="PageQuestions.length === 1"></div>
        <!-- slides end-->
        </swiper>
      </div>
    </div>
    <!--  试题 slide end-->

    <!-- tabber start -->
    <question-tabber ref="tabber" ></question-tabber>
    <!-- tabber end -->

  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Question from './Question'
import QuestionStem from './QuestionStem' // 导入题干组件
import QuestionTabber from './QuestionTabber' // 导入tabber组件
import SharePopup from './SharePopup'
import examAPI from '@/api/exam.js'
export default {
  name: 'QuestionPage',
  props: [],
  components: {
    swiper,
    swiperSlide,
    XHeader,
    Question,
    QuestionStem, // 注册题干组件
    QuestionTabber, // 注册tabber组件
    SharePopup // 分享面板
  },
  data () {
    let app = this
    return {
      PropHeight: document.documentElement.clientHeight - 153,
      sharePopupShow: false,
      showMenus: false,
      isPadding: false,
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
                // 如果是反方向且当前不是第1个题干
                if (direction < 0 && app.curStemGindex !== 0) {
                  let ainx =
                    app.answerSheet.SheetItems.filter(
                      e => e.QID + '' === questionID
                    ).length - 1
                  app.setCurStemGindex({ QID: questionID, QInx: ainx })
                }
                // 如果是正方向且当前不是最后一道试题
                if (
                  direction > 0 &&
                  app.curQuestionID !==
                    app.questionIndexs[app.questionIndexs.length - 1]
                ) {
                  app.setCurStemGindex({ QID: questionID, QInx: 0 })
                  console.log(app.curQuestionID)
                  console.log(app.questionIndexs[app.questionIndexs.length - 1])
                }
              }
            })
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('uiModule', ['headerConf', 'showAnalysis', 'appSkin']),
    ...mapGetters('qModule', ['gotoAnswerSheet', 'ticker', 'examInfo', 'baseInfo', 'stemTotal',
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
    stemIndexChange (questionID, stemindex) {
      console.log('stem index change ' + stemindex)
      // 设置当前题干索引
      this.setCurStemGindex({ QID: questionID, QInx: stemindex })
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
        this.$router.push({ name: 'AnswerSheet' })
      }
    },
    slideStart () {
      console.log('这已经是第一题了')
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
    exitH5 () {
      if (this.baseInfo.oldurl !== undefined && this.baseInfo.oldurl.length > 5) {
        window.location.href = process.env.H5_HOST + this.baseInfo.oldurl + '?fr=ReportPage&userid=' + this.baseInfo.userid + '&examid=' + this.baseInfo.examid + '&productid=' + this.baseInfo.productid +
          '&examrecordid=' + this.baseInfo.examrecordid + '&skin=' + this.appSkin
      } else {
        let content = '是否确定离开，并保存作答记录'
        if (this.showAnalysis) {
          content = '是否确定离开'
        }
        let m = this
        this.$vux.confirm.show({
          // 组件除show外的属性
          title: '温馨提示',
          content: content,
          onConfirm () {
            console.log('要退出了，得调用js桥回到原生应用里了')
            if (!this.showAnalysis) {
              m.savestudyrecord()
            }
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
    closeSharePopup (code, msg) {
      if (window.jsbridge && process.env.APP_Debug) {
        // window.jsbridge.toast(msg)
      }
      this.sharePopupShow = false
    },
    savestudyrecord () {
      if (!process.env.HTML_Debug) {
        examAPI.submitAnswerSheet(this.answerSheet.ExamRecordID, this.ticker, 0, JSON.stringify(this.answerSheet.SheetItems), this.baseInfo.productid, this.baseInfo.examid, this.baseInfo.userid, this.curQuestionID).then((data) => {
        })
      }
    },
    refreshnote () {
      this.setDoRefreshNote(1)
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
    console.log('diyiticeshi')
    console.log(this.curQuestionID)
    let beginIndex = 0
    var qustionindex = this.questionIndexs.indexOf(this.curQuestionID)
    if (qustionindex > 0) {
      beginIndex = qustionindex - 1
      this.RouteIn = true
    } else {
      this.RouteIn = false
    }
    this.setQuestionBeginIndex(beginIndex)
    this.$nextTick(() => {
      this.swiper.slideTo(qustionindex - beginIndex)
      // 第一次 主动绑定是否收藏
      this.$refs.tabber.bindData()
    })
      // 设置副标题
    this.setSubTitle(this.examInfo.ExamName)
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