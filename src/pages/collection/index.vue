<template>
  <div>   
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import qktutils from '../../js/qtkutils'
  import { querystring } from 'vux'
  import examAPI from '@/api/exam'
  import userCollAPI from '@/api/userCollection'
  export default {
    name: 'Collection',
    data () {
      return {}
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'examInfo', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle', 'setShowAnswerSheetBtn', 'setShowAnalysis',
        'setShowUserAnswerText']),
      ...mapActions('qModule', ['setDBQuestions', 'setRemoveCollection', 'setExamInfo', 'setBaseInfo',
        'setAnswerSheet', 'setQuestionIndexs', 'setStemTotal']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          // this.$http.get(process.env.H5_HOST + '/UserCollection/GetListIds?RefId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid + '&UserId=' + this.baseInfo.userid),
          // this.$http.get(process.env.H5_HOST + '/Exam/ExamInfo?ExamId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid)
          userCollAPI.getListIds(this.baseInfo.examid, this.baseInfo.productid, this.baseInfo.userid, 0),
          examAPI.examInfo(this.baseInfo.examid, this.baseInfo.productid)
        ]).then(this.$http.spread((ids, examInfo) => {
          if (ids) {
            console.log(ids)
            let {getAnswerSheetFake, genQuestionIndexs} = require('../../js/fakedata')
            var answerSheetFake = getAnswerSheetFake(ids)
            console.log(answerSheetFake)
            this.answerSheet.SheetItems = answerSheetFake
            console.log(this.answerSheet)
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
      this.setShowAnalysis(true)
      // 设置顶部标题
      this.setTitle('收藏试题')
      // 设置副标题
      this.setSubTitle('试卷名称')
      // 不显示答题卡按钮
      this.setShowAnswerSheetBtn(false)
      // 不显示 正确 错误
      this.setShowUserAnswerText(false)
      this.setRemoveCollection(true)
    }
  }
</script>

<style lang="less" scoped>
</style>
