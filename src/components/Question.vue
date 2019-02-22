
<template>
  <div>
    <load-more tip="正在加载" v-show="showLoading"></load-more>
    <div :style="{height:fullHeight+'px',paddingBottom:ispadding+'px'}" class="references" v-show="qdata && qdata.References"
         ref="myReferences">
      <div class="pad-reference"  v-html="qdata.References"></div>
    </div>
    <div class="accordion" :class="{ObtainMaterial:hasReference}" :style="{bottom:changebottom}">
      <div class="accordion-btn-group" v-if="hasReference">
        <a href="javascript:void (0);" class="accordion-btn" @click="togglebox"></a>
      </div>
      <!--<transition name="mybox">-->
        <div class="accordion-cont" v-show="showStem"  :style="{height:changeheight}">
          <div ref="myAccordion" class="accordion-cont-wrap" >
            <swiper :options="swiperOption" ref="mySecondSwiper">
              <!-- slides -->
              <template v-for="stem in qdata.Stems" >
                <swiper-slide :key="stem.Index">
                  <question-stem @goto-next-slide="gotoNextSlide" ref="questionstems" :stem="stem" :qdata="qdata"></question-stem>
                  <answer-analysis :qdata="qdata"  v-if="showAnalysis"></answer-analysis>
                </swiper-slide>
              </template>
            </swiper>
            <feed-back :qdata="qdata"></feed-back>
            <note-edit v-if="showAnalysis" :qdata="qdata"></note-edit>
          </div>
        </div>
      <!--</transition>-->
    </div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import QuestionStem from './QuestionStem'
  import FeedBack from './FeedBack'
  import { mapGetters } from 'vuex'
  import AnswerAnalysis from './AnswerAnalysis'
  import NoteEdit from './NoteEdit'
  import questionApi from '@/api/question.js'
  import { LoadMore } from 'vux'
  export default {
    name: 'Question',
    props: ['qid'],
    components: {
      NoteEdit,
      AnswerAnalysis,
      FeedBack,
      swiper,
      swiperSlide,
      QuestionStem,
      LoadMore
    },
    data () {
      let app = this
      return {
        toBottom: 0,
        hasRefScrollTop: 0,
        changeheight: 279,
        accordionHeight: 280,
        changebottom: 0,
        boxShow: false,
        ispadding: 280,
        fullHeight: document.documentElement.clientHeight - 150 - 280,
        fullHeightTwo: document.documentElement.clientHeight - 150 - 280,
        refScrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        swiperOption: {
          // autoHeight: true,
          nested: true,
          speed: 200,
          // some swiper options/callbacks
          // 所有的参数同 swiper 官方 api 参数
          // ...
          on: {
            slideChange () {
              app.bindAnswer()
              // 只有当前 试题的 题干swiper发生变化时，则向上发出事件
              if (app.curQuestionID === app.qid) {
                app.$emit('stem-index-change', app.qid, this.activeIndex)
              }
            }
          }
        },
        qdata: {},
        defaultqdata: {
          References: ''
        },
        noqdata: {
          References: '<div style="text-align: center;">加载失败</div>'
        },
        showLoading: false
      }
    },
    computed: {
      ...mapGetters('uiModule', ['showAnalysis']),
      ...mapGetters('qModule', ['baseInfo', 'answerSheet', 'curStemGindex', 'curQuestionID']),
      showStem () {
        if (this.hasReference) {
          this.changeheight = 279 + 'px'
        } else if (!this.hasReference) {
          this.changeheight = this.fullHeight + 280 + 'px'
        }
        return this.hasReference || !this.boxShow
      },
      swiperTwo () {
        return this.$refs.mySecondSwiper.swiper
      },
      hasReference () {
        return this.qdata && this.qdata.References && this.qdata.References.length > 0
      }
      // showQuestinoAnalysis () {
      //   console.log('answerSheet changed')
      //   let IsDs = this.answerSheet.SheetItems.filter(e => {
      //     return e.QID === this.qid && e.IsD === true
      //   })
      //   if (IsDs.length === this.qdata.Stems.length) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }
    },
    watch: {
      qid: {
        handler (newName, oldName) {
          this.showQuestion()
        },
        immediate: true
        // deep: true
      },
      curStemGindex () {
        this.slideToCurStem()
      }
      // ,
      // answerSheet () {
      //   console.log('answerSheet changed')
      //   let IsDs = this.answerSheet.SheetItems.filter(e => {
      //     return e.QID === this.qid && e.IsD === true
      //   })
      //   if (IsDs.length === this.qdata.Stems.length) {
      //     this.showQuestinoAnalysis = true
      //   }
      // }
    },
    methods: {
      showQuestion () {
        this.qdata = this.defaultqdata
        this.showLoading = true
        // 获取具体试题数据
        questionApi.getList(this.qid, this.baseInfo.userid, this.baseInfo.productid)
        .then((data) => {
          if (data.qid !== this.qid) return // 回调时，判断回调的数据是否是当前试题的数据
          if (data.data) {
            this.qdata = data.data
            this.slideToCurStem()
          } else {
            this.qdata = this.noqdata
          }
          this.showLoading = false
        })
      },
      slideToCurStem () {
        // 如果组件显示的是当前题, 则子swiper滑动到相应页面
        if (this.qid === this.curQuestionID) {
          var item = this.answerSheet.SheetItems[this.curStemGindex]
          if (item) {
            // 如果当前题干的不在对应的位置，则移动
            if (this.swiperTwo.activeIndex !== item.QInx) {
              this.swiperTwo.slideTo(item.QInx, 0)
            }
          }
        }
      },
      togglebox: function () {
        this.boxShow = !this.boxShow
        if (this.boxShow) {
          // 隐藏
          this.fullHeight = this.fullHeightTwo + 280
          this.changebottom = (-280) + 'px'
          this.ispadding = 0
        } else {
          // 出现
          this.fullHeight = this.fullHeightTwo
          this.ispadding = 280
          this.changebottom = 0 + 'px'
        }
      },
      gotoNextSlide () {
          // 如果是最后一个题干，则向上激发事件
        if (this.swiperTwo.isEnd) {
          console.log('去下一试题')
          this.$emit('goto-next-slide', this.swiperTwo.activeIndex)
        } else {
          this.swiperTwo.slideNext()
        }
      },
      hideStem () {
        this.boxShow = false
        // 默认出现
        this.fullHeight = this.fullHeightTwo
        this.ispadding = 280
        this.changebottom = 0 + 'px'
        if (this.hasReference) {
          this.$nextTick(() => {
            if (this.$refs.myReferences) {
              this.$refs.myReferences.scrollTop = 0
            }
          })
        }
      },
      bindAnswer () {
        if (this.$refs.questionstems && this.$refs.questionstems.length > 0) {
          this.$refs.questionstems.forEach(e => {
            e.bindAnswer()
          })
        }
      },
      scrolltop () {
        if (this.hasReference) {
          this.$nextTick(() => {
            this.boxShow = false
            if (this.$refs.myReferences) {
              this.$refs.myReferences.scrollTop = 0
            }
          })
        } else if (!this.hasReference) {
          this.boxShow = false
          this.fullHeight = this.fullHeightTwo
          this.changebottom = 0 + 'px'
          return false
        }
      }
    },
    beforeMount () {
      this.scrolltop()
    },
    mounted () {
      this.scrolltop()
    },
    updated () {
      this.bindAnswer()
    }
  }
</script>

<style scoped lang="less">
  .accordion-cont {
    height: auto;
    overflow-y:scroll;
    border-top: none;
    background-color: #fff;
    display: block;
    .accordion-cont-wrap {
      padding: 10px 0 0;
      background: #fff;
    } 
  }
  .accordion-btn-group {
    width: 100%;
    display: block;
    a {
      width: 54px;
      height: 27px;
      margin: 0 auto;
      background-size:100% 100%;
      display: block;
    }
  }
  
  .ObtainMaterial {
    position: absolute;
    bottom: 27px;
    z-index: 999;
    width: 100%;
      .accordion-cont {
      height: 279px;
      overflow-y: scroll;
      border-top: 1px solid #e5e5e5;
      background-color: #f4f4f4;
      .accordion-cont-wrap {
        background: #f4f4f4;
      }
      .accordion-btn-group {
        display: block;
      }
    } 
  }
  .references {
    padding: 0 15px 0px;
    min-height: 10px;
    overflow-y: scroll;
  }
  .swiper-slide{
    height: 10px;
  }
  .swiper-slide-active {
    height: auto;
  }
  .pad-reference{
    padding-bottom: 30px;
  }
</style>