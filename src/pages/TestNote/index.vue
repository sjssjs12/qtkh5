<template>
  <div>   
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import qktutils from '../../js/qtkutils'
  import { querystring } from 'vux'
  import questionApi from '@/api/question.js'
  export default {
    name: 'TestNote',
    data () {
      return {}
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setShowTabber', 'setShowAnalysis', 'setShowAnswerArea',
        'setShowUserAnswerText']),
      ...mapActions('qModule', ['setDBQuestions', 'setBindAnswerSrc', 'setBaseInfo', 'setAnswerSheet',
        'setQuestionIndexs']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        // this.$http.get(process.env.H5_HOST + 'Question/Info?qid=' + this.baseInfo.questionid + '&userid=' + this.baseInfo.userid + '&pid=' + this.baseInfo.productid)
        questionApi.info(this.baseInfo.questionid, this.baseInfo.userid, this.baseInfo.productid)
        .then((data) => {
          if (data) {
            this.dbQuestions.push(data)
            qktutils.saveLocalQuestion(this.dbQuestions)
          }
        }).then(() => {
          this.$router.push({name: 'QuestionTiled'})
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
        this.$router.push({name: 'QuestionTiled'})
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
      this.setShowUserAnswerText(false)
      this.setShowAnalysis(true)
      // 设置顶部标题
      this.setTitle('我的笔记')
      // 隐藏底部 Tabber
      this.setShowTabber(false)
      // 不显示答案区域
      this.setShowAnswerArea(false)
      // 显示题干里的原答案
      this.setBindAnswerSrc(1)
    }
  }
</script>

<style lang="less"  scoped>  
</style>
