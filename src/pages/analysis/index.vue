<template>
  <div>   
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { querystring } from 'vux'
  import qktutils from '../../js/qtkutils'
  import baseMock from '@/mock/baseMock'
  import examAPI from '@/api/exam'
  import examSectionApi from '@/api/examSection'
  export default {
    name: 'Analysis',
    data () {
      return {}
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'examInfo', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle', 'setShowAnalysis']),
      ...mapActions('qModule', ['setDBQuestions', 'setGotoAnswerSheet', 'setExamSection', 'setExamInfo',
        'setBaseInfo', 'setAnswerSheet', 'setQuestionIndexs']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          examAPI.examInfo(this.baseInfo.examid, this.baseInfo.productid),
          examSectionApi.dataList(this.baseInfo.examid),
          examAPI.getExamReport(this.baseInfo.examrecordid)
          // this.$http.get(process.env.H5_HOST + '/Exam/ExamInfo?ExamId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid),
          // this.$http.get(process.env.H5_HOST + '/ExamSection/DataList?ExamId=' + this.baseInfo.examid),
          // this.$http.get(process.env.H5_HOST + '/Exam/GetExamReport?ExamRecordID=' + this.baseInfo.examrecordid)
        ]).then(this.$http.spread((examInfo, section, reAnSheet) => {
          if (examInfo) {
            this.setExamInfo(examInfo)
            this.setSubTitle(this.examInfo.ExamName)
          }
          if (section) {
            this.setExamSection(section)
          }
          if (reAnSheet) {
            this.setAnswerSheet(reAnSheet)
          }
        })).then(() => {
          let {genQuestionIndexs} = require('../../js/fakedata')
          let qd = genQuestionIndexs(this.answerSheet)
          this.setQuestionIndexs(qd)
        }).then(() => {
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
          // 获取本地结构数据
        let jg1 = JSON.parse(JSON.stringify(baseMock.examSection()))
        this.setExamSection(jg1)
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
        console.log('从服务器取数据')
        this.getDataFromSrv()
      } else {
        this.getFakeData()
      }
      // 显示答案解析
      this.setShowAnalysis(true)
      // 设置顶部标题
      this.setTitle('试题解析')
      // 设置副标题
      this.setSubTitle('试卷名称')
      // 答完题后，跳至答题卡
      this.setGotoAnswerSheet(true)
    }
  }
</script>

<style lang="less" scoped>
</style>
