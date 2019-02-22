<template>
  <div>   
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { querystring } from 'vux'
  import qktutils from '../../js/qtkutils'
  import examAPI from '@/api/exam'
  import userErrorAPI from '@/api/userAnswerError'
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
      ...mapActions('qModule', ['setDBQuestions', 'setBindAnswerSrc', 'setExamInfo', 'setBaseInfo',
        'setAnswerSheet', 'setQuestionIndexs', 'setAnswerSheetStems']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          // this.$http.get(process.env.H5_HOST + 'UserAnswerError/GetListIds?RefId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid + '&UserId=' + this.baseInfo.userid),
          // this.$http.get(process.env.H5_HOST + 'Exam/ExamInfo?ExamId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid)
          userErrorAPI.getListIds(this.baseInfo.examid, this.baseInfo.productid, this.baseInfo.userid, 0),
          examAPI.examInfo(this.baseInfo.examid, this.baseInfo.productid)
        ]).then(this.$http.spread((ids, examInfo) => {
          if (ids) {
            console.log(ids)
            let {getAnswerSheetFake, genQuestionIndexs} = require('../../js/fakedata')
            var answerSheetFake = getAnswerSheetFake(ids)
            this.setAnswerSheetStems(answerSheetFake)
            var questionIndexs = genQuestionIndexs(this.answerSheet)
            this.setQuestionIndexs(questionIndexs)
          }
          if (examInfo) {
            this.setExamInfo(examInfo)
            this.setSubTitle(this.examInfo.ExamName)
          }
        })).then(() => {
          this.$router.push({name: 'QuestionPage'})
          this.$vux.loading.hide()
        })
      },
      getFakeData () {
        let {genAnswersheet, genDBquestions, genQuestionIndexs} = require('../../js/fakedata')
          // 获取假数据
        var answerSheet = genAnswersheet()
        this.setAnswerSheet(answerSheet)
          // 根据答题卡生成试题ID列表
        var questionIndexs = genQuestionIndexs(answerSheet)
        this.setQuestionIndexs(questionIndexs)
          // 根据答题卡组装测试用的试题数据
        var dbq = genDBquestions(answerSheet, questionIndexs)
        this.setDBQuestions(dbq)
        // 将试题保存到localstorage
        qktutils.saveLocalQuestion(this.dbQuestions)
        // 去答题页面
        this.$router.push({name: 'QuestionPage'})
      }
    },
    created () {
      let params = querystring.parse()
      if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
        // 如果params是空，则造点假数据
        params = {
          examid: 317,
          productid: 4,
          userid: 650814,
          examrecordid: 219866,
          questionid: 31892,
          oldurl: '',             // 上一步访问连接
          appid: '100005',        // 配置中心产品包通用id
          reportkey: 'ceshijilu'  // 记录来源
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
      // 设置顶部标题
      this.setTitle('错题本')
      // 设置副标题
      this.setSubTitle('试卷名称')
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
