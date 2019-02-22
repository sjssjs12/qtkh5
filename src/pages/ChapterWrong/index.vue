<template>
  <div>   
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { querystring } from 'vux'
  import userErrorAPI from '@/api/userAnswerError'
  import answerSheetApi from '@/api/answersheet'
  export default {
    name: 'WrongBook',
    data () {
      return {}
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'examInfo', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle', 'setShowRemove', 'setShowAnswerSheetBtn',
        'setShowAnalysis', 'setShowAnswerArea', 'setShowUserAnswerText']),
      ...mapActions('qModule', ['setDBQuestions', 'setBindAnswerSrc', 'setSubjectInfo', 'setBaseInfo',
        'setAnswerSheet', 'setQuestionIndexs', 'setAnswerSheetStems', 'addAnswerSheetStems']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          userErrorAPI.getListIds(this.baseInfo.subsubjectid, this.baseInfo.productid, this.baseInfo.userid, 1),
          answerSheetApi.subInfo(this.baseInfo.productid, this.baseInfo.subsubjectid)
        ]).then(this.$http.spread((ids, subInfo) => {
          if (ids) {
            console.log(ids)
            let {getAnswerSheetFake, genQuestionIndexs} = require('../../js/fakedata')
            var answerSheetFake = getAnswerSheetFake(ids)
            this.setAnswerSheetStems(answerSheetFake)
            var questionIndexs = genQuestionIndexs(this.answerSheet)
            this.setQuestionIndexs(questionIndexs)
          }
          if (subInfo) {
            this.setSubjectInfo(subInfo)
          // 设置顶部标题
            this.setTitle('错题本')
          // 设置副标题
            this.setSubTitle(subInfo.Name)
          }
        })).then(() => {
          this.$router.push({name: 'ChapterPage'})
          this.$vux.loading.hide()
        })
      },
      getFakeData () {
        answerSheetApi.getAnswerQuestions(this.baseInfo.productid, this.baseInfo.userid, this.baseInfo.subsubjectid).then(sheets => {
          // 添加到vuex
          this.addAnswerSheetStems(sheets)
          // 去答题页面
          this.$router.push({name: 'ChapterPage'})
          // 设置顶部标题
          this.setTitle('错题本')
          // 设置副标题
          this.setSubTitle('试卷名称')
        })
      }
    },
    created () {
      let params = querystring.parse()
      if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
        // 如果params是空，则造点假数据
        params = {
          productid: 25,
          userid: 69031,
          subsubjectid: 927
        }
      }
      this.setBaseInfo(params)
      // 从服务端获取数据
      if (!process.env.HTML_Debug) {
        this.getDataFromSrv()
      } else {
        this.getFakeData()
      }
      // 显示 “正确” “答题错误”
      this.setShowUserAnswerText(false)
      // 显示解析
      this.setShowAnalysis(true)
      // 显示移除
      this.setShowRemove(true)
      // 隐藏答题卡
      this.setShowAnswerSheetBtn(false)
      //  不显示答案区域
      this.setShowAnswerArea(false)
      // 显示题干里的原答案
      this.setBindAnswerSrc(1)
    }
  }
</script>

<style lang="less"  scoped>
</style>
