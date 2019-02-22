<template>
  <div v-if="qTabberConf.showTabber">
    <div class="tabbar-wrap">
      <div class="item-tabber">
        <div class="item-tabber-icon"  @click="toggleFavourite"><b :class="like"></b></div>
        <p class="item-tabber-label" :class="{'toggleColor' : this.favourite}">收藏</p>
      </div>
      <router-link  :to="{name:'AnswerSheet'}" class="item-tabber" v-if="qTabberConf.showAnswerSheetBtn">
        <div class="item-tabber-icon"><img src="../images/answerSheet.png"/></div>
        <p class="item-tabber-label">答题卡</p>
      </router-link>
      <div @click="timerPause" class="item-tabber" v-if="!showAnalysis">
        <div class="item-tabber-icon"><img src="../images/clock.png"/></div>
        <p class="item-tabber-label item-tabber-label-color">{{timerStr}}</p>
      </div>
      <div class="item-tabber" v-if="qTabberConf.showRemove" @click="removeWrong">
        <div class="item-tabber-icon"><img src="../images/remove.png"/></div>
        <p class="item-tabber-label">移除</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import qtkutils from '../js/qtkutils'
  import collectionAPI from '@/api/userCollection'
  import errorAPI from '@/api/userAnswerError'
  export default {
    name: 'QuestionTabber',
    components: {},
    data () {
      return {
        timer: null,
        favourite: false
      }
    },
    computed: {
      ...mapGetters('uiModule', ['qTabberConf', 'showAnalysis']),
      ...mapGetters('qModule', ['removeCollection', 'ticker', 'baseInfo', 'curQuestionID', 'answerSheet',
        'questionIndexs', 'curStemGindex', 'questionBeginIndex']),
      timerStr () {
        let f = parseInt(this.ticker / 60)
        let m = this.ticker % 60
        if (f < 10) {
          f = '0' + f
        }
        if (m < 10) {
          m = '0' + m
        }
        return `${f}:${m}`
      },
      like () {
        if (this.favourite) {
          return 'like-h'
        } else {
          return 'like'
        }
      }
    },
    watch: {
      curQuestionID () {
        this.bindData()
      }
    },
    methods: {
      ...mapActions('qModule', ['setFavourite', 'tickerAdd', 'setAnswerSheet', 'setCurStemGindex', 'setQuestionBeginIndex']),
      bindData () {
        qtkutils.getCurrentQuestion(this.curQuestionID, (data) => {
          if (this.removeCollection) {
            this.favourite = true
          } else {
            this.favourite = data.IsFavorited
          }
        })
        // if (item.length > 0) {
        //   this.favourite = item[0].IsFavorited
        // } else {
        //   this.favourite = false
        // }
      },
      toggleFavourite () {
        this.favourite = !this.favourite
        this.setFavourite({qid: this.curQuestionID, value: this.favourite})
        this.doPost(this.curQuestionID, this.favourite)
      },
      removeWrong () {
        console.log(`移除当前试题 ${this.curQuestionID}`)
        if (!process.env.HTML_Debug) {
          errorAPI.answerErrorRemove(this.curQuestionID, this.baseInfo.userid).then(({data}) => {})
        }
        this.refresh()
      },
      timerStop () {
        if (this.timer) {
          clearInterval(this.timer)
        }
      },
      timerStart () {
        this.timer = setInterval(() => {
          this.tickerAdd(1)
        }, 1000)
      },
      timerPause () {
        let app = this
        this.timerStop()
        this.$vux.alert.show({
          title: '暂停计时，休息一下',
          content: '已用时' + app.timerStr,
          buttonText: '继续答题',
          onShow () {
          },
          onHide () {
            app.timerStart()
          }
        })
      },
      doPost (questionid, value) {
        qtkutils.updateCollection(questionid, value)
        if (!process.env.HTML_Debug) {
          if (value) {
            collectionAPI.collectionAdd(this.baseInfo.userid, this.baseInfo.productid, questionid, this.baseInfo.examid, 0).then(({data}) => {
            })
          } else {
            collectionAPI.collectionRemove(questionid, this.baseInfo.productid, this.baseInfo.userid).then(({data}) => {})
          }
        }
        console.log(`发出请求修改收藏, qid:${questionid}, 值:${value}`)
        if (this.removeCollection) {
          this.refresh()
        }
      },
      refresh () {
        let {getAnswerSheetReload} = require('../js/fakedata')
        let oldlength = this.answerSheet.SheetItems.length
        let b = this.questionIndexs.indexOf(this.curQuestionID)
        if (this.questionIndexs.length === 1) {
          this.setAnswerSheet(getAnswerSheetReload(this.answerSheet, this.curQuestionID))
          this.questionIndexs.splice(b, 1)
        } else {
          if (this.curQuestionID !== this.questionIndexs[this.questionIndexs.length - 1]) {
            this.setAnswerSheet(getAnswerSheetReload(this.answerSheet, this.curQuestionID))
            this.setCurStemGindex({QID: this.questionIndexs[b], QInx: 0})
          } else {
            this.setAnswerSheet(getAnswerSheetReload(this.answerSheet, this.curQuestionID))
            this.questionIndexs.splice(b, 1)
            this.setCurStemGindex({QID: this.questionIndexs[this.questionIndexs.length - 1], QInx: 0})
            let newlength = this.answerSheet.SheetItems.length
            this.setQuestionBeginIndex(this.questionBeginIndex - (oldlength - newlength))
          }
        }
      }
    },
    created: function () {
    },
    mounted () {
      this.timerStart()
    },
    beforeDestroy () {
      this.timerStop()
    }
  }
</script>

<style lang="less" scoped>
  .tabbar-wrap {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: absolute;
    z-index: 500;
    bottom: 0;
    width: 100%;
    background-color: #F7F7FA;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #C0BFC4;
      color: #C0BFC4;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .item-tabber {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 5px 0 0;
    font-size: 0;
    color: #999999;
    text-align: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .item-tabber-icon {
    position: relative;
    display: inline-block;
    width: 24px;
    img {
      width: 100%;
      height: 100%;
    }
    b.like,b.like-h{
      background-size: cover;
      width: 100%;
      height: 23px;
      display: block;
    }
  }
  .item-tabber-label {
    text-align: center;
    color: #999999;
    font-size: 12px;
    line-height: 1.8;
  }
</style>
