<template>
  <div>
    <div class="pd-question">
      <div class="stem-question" v-html="stem.Content"></div>
      <checker  v-model="stemAnswer"  :radio-required="isSingle" :type="checkertype" :default-item-class="defaultitemclass"
             selected-item-class="demo1-item-selected"  >
        <template  v-for="o in stem.Options" >
          <checker-item  :value="o.Index" :key="o.Index" @on-item-click="clickMe(o.Index)" class="clearfix" :disabled="checkerDisabled(o.Index)">
            <div class="q_item_1"><div class="zm" :class="checkClass(o.Index)">{{o.Code}}</div></div><div class="q_item_2" v-html="o.Content"></div>
          </checker-item>
        </template>
      </checker>
      <p v-if="isSubjective" class="pfont">(本题不支持作答)</p>
      <template v-if="!hideBtnTemplate">
        <button class="sureButton" v-if="!showAnalysis"  v-show="showButton"  @click="stemComplete()">{{completeBtnText}}</button>
      </template>
    </div>
    <!--答案显示-->
    <template v-if="stemShowAnswer">
      <div class="answerAnalysis-box" v-if="showAnswerArea">
        <div class="answerAnalysis-content">
          <h2><span></span>答案:</h2>
          <div v-if="!isD"><i class="i-color1" v-if="showUserAnswerText">你未作答,</i>正确答案<i class="i-color2">{{correctAnswer}}</i></div>
          <!-- <div v-else-if="isCorrect" style="color: #09BB07"><i v-if="showUserAnswerText">作答正确,</i>正确答案<i class="i-color2">{{correctAnswer}}</i></div> -->
          <div v-else-if="isCorrect"><i v-if="showUserAnswerText" class="i-color2">作答正确,</i>正确答案<i class="i-color2">{{correctAnswer}}</i>,您的答案<i class="i-color3">{{errorAnswer}}</i></div>
          <div v-else><i class="i-color1" v-if="showUserAnswerText">作答错误,</i>正确答案<i class="i-color2">{{correctAnswer}},</i>您的答案<i class="i-color3">{{errorAnswer}}</i></div>
        </div>
      </div>
    </template>
    <answer-analysis :qdata="qdata"  v-if="chapterShowAnalysis"></answer-analysis>
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { Checker, CheckerItem, debounce } from 'vux'
    import { arrayEqual, ints2Chars, isArray } from '../js/sdutils'
    import AnswerAnalysis from './AnswerAnalysis'
    import questionAPI from '@/api/question'
    export default {
      name: 'QuestionStem',
      props: ['stem', 'qdata', 'seldisabled', 'showAnswer', 'hideBtnTemplate'],
      components: {
        Checker,
        CheckerItem,
        AnswerAnalysis
      },
      data () {
        return {
          hasBindanswer: false,
          viewShow: false,
          stemAnswer: '', // 当前题的答案，多选为数组
          isCorrect: false, // 当为解析时，用户答案是否正确
          isD: false, // 判断用户是否已答
          // ainxs: [],
          errorAnswer: ''
        }
      },
      computed: {
        ...mapGetters('uiModule', ['showAnalysis', 'showAnswerArea', 'showUserAnswerText', 'doExercise', 'goNextStemWhenFin']),
        ...mapGetters('qModule', ['bindAnswerSrc', 'answerSheet', 'baseInfo', '']),
        stemShowAnswer () {
          // 多种情况 显示答案面板
    
          // 1父组件传入值showAnswer 2试题解析页面且不是主观题   3刷题模式且已答
          return this.showAnswer || (this.showAnalysis && !this.isSubjective) || (this.doExercise && this.isD && !this.isSubjective)
        },
        chapterShowAnalysis () {
          return this.doExercise && this.isD
        },
        isSingle () {
          return this.stem.AnswerOptionsIndexs.length < 2
        },
        isSubjective () {
          // 是否是主观题
          return this.stem.Options.length === 0
        },
        completeBtnText () {
          if (this.doExercise) {
            return '查看答案'
          } else {
            if (this.isSubjective) {
              return '已阅'
            } else {
              return '确定'
            }
          }
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
        showButton () {
          return !this.isSingle || this.isSubjective
        },
        correctAnswer () {
          console.log(this.stem)
          return ints2Chars(this.stem.AnswerOptionsIndexs).join('')
        }
      },
      methods: {
        ...mapActions('qModule', ['setAnswer', 'setBindAnswerSrc']),
        ...mapActions('uiModule', ['setDoSubjective']),
        checkerDisabled (index) {
          if (this.showAnalysis || this.hideBtnTemplate) {
            return true // 不可选
          }
          if (this.doExercise && this.isD) {
            if (!this.isSingle) return true
            // 如果选项不在答案里，则禁用
            if (isArray(this.stemAnswer)) {
              // return this.stemAnswer.indexOf(index) === -1 // false
            } else {
              if (index !== this.stemAnswer) {
                return true // true
              }
            }
          }
          return false // 可选
        },
        checkClass (index) {
          // 绑定用户和正确答案到题干
          if (!this.hideBtnTemplate && this.doExercise) {
            let item = this.answerSheet.SheetItems.filter(e => e.QID === parseInt(this.qdata.QuestionID) && e.QInx === parseInt(this.stem.Index))
            if (this.stem && this.stem.AnswerOptionsIndexs && this.stem.AnswerOptionsIndexs.indexOf(index) > -1 && this.isD === true) {
              // 正确答案存在
              return 'span-green'
            } else if (item[0].UIs && item[0].UIs.indexOf(index) > -1 && this.isD === true) {
              // 用户的答案存在
              return 'span-red'
            }
          }
        },
        clickMe: debounce(function (value) {
          if (this.seldisabled) return
          if (this.showAnalysis) return
          if (this.doExercise && this.isD) return
          if (this.isSingle) {
            this.stemAnswer = value
            this.stemComplete()
          }
        }, 300),
        stemComplete () {
          if (!this.isSubjective && this.stemAnswer.length === 0) {
            // this.$vux.alert.show({content: '请选择答案'})
            this.$vux.toast.show({text: '请选择答案', type: 'warn'})
            return
          }
          let ainxs = []
          ainxs = ainxs.concat(this.stemAnswer).sort()
          let corUis = this.stem.AnswerOptionsIndexs.sort()
          this.isCorrect = arrayEqual(ainxs, corUis)
          if (this.isSubjective) {
            this.isCorrect = false
          }
          this.setAnswer({ qid: this.qdata.QuestionID, qinx: this.stem.Index, ainxs: ainxs, IsC: this.isCorrect })
          if (this.doExercise) {
            this.$nextTick(() => {
              this.bindAnswer()
            })
            let id = this.answerSheet.SheetItems.filter(e => e.QID === this.qdata.QuestionID && e.QInx === this.stem.Index)[0].ID
            questionAPI.submitQuestion(this.baseInfo.userid, this.baseInfo.productid, id, this.qdata.QuestionID, this.isCorrect, JSON.stringify(ainxs)).then((data) => {})
          }

          if (this.goNextStemWhenFin) {
            this.nextStem()
          }
        },
        nextStem () { // 去下一题
          this.$emit('goto-next-slide')
        },
        bindAnswer () {
          // 如果是绑定题干里的答案
          // k 直接显示答案（我的笔记）
          if (this.bindAnswerSrc === 1) {
            if (this.isSingle) {
              this.stemAnswer = this.stem.AnswerOptionsIndexs[0]
            } else {
              this.stemAnswer = this.stem.AnswerOptionsIndexs
            }
            return
          }
          // 显示用户所作答案
          let qid = parseInt(this.qdata.QuestionID)
          let qinx = parseInt(this.stem.Index)
          let item = this.answerSheet.SheetItems.filter(e => e.QID === qid && e.QInx === qinx)
          if (item.length > 0) {
            if (this.isSingle) {
              this.stemAnswer = item[0].UIs[0]
            } else {
              this.stemAnswer = item[0].UIs
            }
            this.isCorrect = item[0].IsC
            this.isD = item[0].IsD
            this.errorAnswer = ints2Chars(item[0].UIs).join('')
          }
          // if (this.doExercise) {
          //   // 显示题干里的原答案
          //   this.setBindAnswerSrc(2)
          // }
        },
        viewParse () {
          this.viewShow = !this.viewShow
        }
      }
    }
</script>

<style scoped lang="less">
  .pd-question{
    padding: 0 15px 15px
  }
  .stem-question{
    video{
      width: 100% ;
      height: auto;
    }
    audio{
      width: 100% ;
      height: auto;
    }
  }
  .demo1-item {
    margin-top: 3%;
    display: block;
  }
  .q_item_1{
    width: 10%;
    text-align: center;
    font-size: 20px;
    line-height: 100%;
    position: relative;
    float: left;
  }
  .zm{
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    border: 1px solid #5f656c;
    font-size: 16px;
    color: #666666;
  }
  .q_item_2{
    width: 88%;
    margin-left: 2%;
    line-height: 32px;
    border-bottom: 1px solid #eaeaea;
    font-size: 15px;
    float: left;
    img{
      width: 100%;
      }
  }
  .demo1-item .q_item_2:last-child{
    border-bottom: none;
  }
  .demo1-item-selected .q_item_1 .zm{
    color: #fff;
  }
  .many-demo1-item .zm{
    border-radius: 5px;
  }
  .span-red, .span-green{
    color: #fff;
  }
  .demo1-item-selected .q_item_1 .span-red{
    background: #f15f5f!important;
    border:1px solid #f15f5f!important;
  }
  .span-green{
    background: #48c867!important;
    border:1px solid #48c867!important;
  }
  .answerAnalysis-box{
    position: relative;
    background: #eee;
    &:before{
      position: absolute;
      content: '';
      border-top: 9px solid #fff;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid transparent;
      left: 50%;
      margin-left: -9px;
      top:0px;
    }
    h2{
      margin: 15px 0 5px;
      padding-top: 10px;
      color: #222222;
      font-size:16px;
      line-height: 20px;
      font-weight: normal;  
      position: relative;
      span{
        line-height: 20px;
        height: 20px;
        padding-left: 3px;   
      }
    }
  }
  .ObtainMaterial .answerAnalysis-box{
    background: #eeeeee;
    &:before{
      border-top: 9px solid #f4f4f4;
    }
  }
  .answerAnalysis-content {
    div{
      padding: 5px 10px;
      font-size: 15px;
      letter-spacing: 1px;
    }
    i{
      font-style: normal;
    }
    i.i-color1{
      color: #f96563;
    }
    i.i-color2{
      color: #48c867;
    }
  }
  .pfont{font-size: 14px;color: #999;margin-top: 5px;}
</style>