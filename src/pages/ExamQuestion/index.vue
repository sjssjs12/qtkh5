<template>
  <div>      
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { querystring } from 'vux'
  import qktutils from '../../js/qtkutils'
  import baseMock from '@/mock/baseMock'
  import sectionAPI from '@/api/examSection.js'
  import examAPI from '@/api/exam.js'
  export default {
    name: 'ExamQuestion',
    components: {},
    data () {
      return {
        appid: '',
        reportkey: ''
      }
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'examInfo', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle']),
      ...mapActions('qModule', ['setDBQuestions', 'setGotoAnswerSheet', 'setExamSection', 'tickerAdd',
        'setExamInfo', 'setBaseInfo', 'setAnswerSheet', 'setQuestionIndexs']),
      getDataStatus () {
        let app = this
        if (this.baseInfo.appid !== undefined && this.baseInfo.reportkey !== undefined) {
          this.appid = this.baseInfo.appid
          this.reportkey = this.baseInfo.reportkey
          console.log(this.baseInfo)
        }
        // 获取当前用户已有考试的状态
        examAPI.examStatus(this.baseInfo.examid, this.baseInfo.userid, this.appid, this.reportkey).then((data) => {
          if (data === 0) {
            this.$vux.confirm.show({
              title: '温馨提示 ',
              content: '<p class="tip-sure">是否进行上次进度</p>',
              onCancel () {
                app.getDataFromSrv(false) // 重新做题
              },
              onConfirm () {
                app.getDataFromSrv(true) // 继续做题
              }
            })
          } else {
            app.getDataFromSrv(false) // 重新做题
          }
        })
      },
      getDataFromSrv (isGoOn) {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          examAPI.examInfo(this.baseInfo.examid, this.baseInfo.productid),
          sectionAPI.dataList(this.baseInfo.examid),
          examAPI.answerSheet(this.baseInfo.examid, this.baseInfo.userid, this.baseInfo.productid, this.appid, this.reportkey, isGoOn)
        ]).then(this.$http.spread((examInfo, section, reAnSheet) => {
          if (examInfo) {
            this.setExamInfo(examInfo)
            this.setTitle(examInfo.ExamTypeName)
            this.setSubTitle(examInfo.ExamName)
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
          this.tickerAdd(this.answerSheet.ElapsedMinutes)
          this.setQuestionIndexs(qd)
        }).then(() => {
          let curQuestionID = this.questionIndexs[0]
          if (isGoOn) {
            examAPI.getQuestionId(this.baseInfo.examid, this.baseInfo.userid, this.baseInfo.productid, this.appid, this.reportkey).then((data) => {
              curQuestionID = data.obj
              this.$router.push({name: 'QuestionPage', query: {qid: curQuestionID, qinx: 0}})
            })
          } else {
            this.$router.push({name: 'QuestionPage', query: {qid: curQuestionID, qinx: 0}})
          }
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

        this.setTitle('模拟试题')
        this.setSubTitle('某试卷名称')
  
        // 去答题页面
        this.$router.push({name: 'QuestionPage'})
      }
    },
    created () {
      let params = querystring.parse()
      if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
        // 如果params是空，则造点假数据
        params = {
          examid: 504,
          productid: 1,
          userid: 69031     // 上一步访问连接
          // appid: '100005',        // 配置中心产品包通用id
          // reportkey: 'ceshijilu'  // 记录来源
        }
      }
      this.setBaseInfo(params)
      // 从服务端获取数据
      if (!process.env.HTML_Debug) {
        // this.getDataFromSrv()
        this.getDataStatus()
      } else {
        this.getFakeData()
      }
      // 答完题后，跳至答题卡
      this.setGotoAnswerSheet(true)
    }
  }
</script>

<style lang="less"  scoped>
</style>
