<template>
  <div>    
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { querystring } from 'vux'
  import qktutils from '../../js/qtkutils'
  import ViewBox from 'vux/src/components/view-box/index'
  import examAPI from '@/api/exam.js'
  import sectionAPI from '@/api/examSection.js'
  export default {
    name: 'ReportPage',
    components: {ViewBox},
    data () {
      return {}
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'examInfo', 'baseInfo', 'answerSheet'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle']),
      ...mapActions('qModule', ['setDBQuestions', 'setExamSection', 'setExamInfo', 'setExamRecord', 'setBaseInfo',
        'setAnswerSheet', 'setQuestionIndexs']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          examAPI.examInfo(this.baseInfo.examid, this.baseInfo.productid),
          sectionAPI.dataList(this.baseInfo.examid),
          examAPI.getExamReport(this.baseInfo.examrecordid),
          examAPI.getExamRecord(this.baseInfo.examrecordid)
        ]).then(this.$http.spread((examInfo, section, reAnSheet, reRecord) => {
          if (examInfo) {
            this.setExamInfo(examInfo)
            this.setSubTitle(examInfo.ExamName)
          }
          if (reRecord) {
            this.setExamRecord(reRecord)
          }
          if (section) {
            this.setExamSection(section)
          }
          if (reAnSheet) {
            this.setAnswerSheet(reAnSheet)
          }
        })).then(() => {
          this.$router.push({name: 'PracticeReport'})
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
        this.$router.push({name: 'PracticeReport'})
      }
    },
    created () {
      let params = querystring.parse()
      if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
        // 如果params是空，则造点假数据
        params = {
          examid: 595,
          productid: 27,
          userid: 69031,
          examrecordid: 221248,
          oldurl: '',             // 上一步访问连接
          appid: '100005',        // 配置中心产品包通用id
          reportkey: 'ceshijilu'  // 记录来源
        }
      }
      this.setBaseInfo(params)
      // 从服务端获取数据
      if (!process.env.HTML_Debug) {
        console.log('请求服务器数据')
        this.getDataFromSrv()
      } else {
        this.getFakeData()
      }
      // 设置顶部标题
      this.setTitle('练习报告')
      // 设置副标题
      this.setSubTitle('试卷名称')
    }
  }
</script>

<style lang="less" scoped>
</style>
