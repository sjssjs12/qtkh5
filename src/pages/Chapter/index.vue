<template>
  <div>      
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { querystring } from 'vux'
  // import qktutils from '../../js/qtkutils'
  // import baseMock from '@/mock/baseMock'
  import answerSheetApi from '@/api/answersheet'
  export default {
    name: 'Chapter',
    components: {},
    data () {
      return {
        appid: '',
        reportkey: ''
      }
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle', 'setDoExercise', 'setGoNextStemWhenFin']),
      ...mapActions('qModule', ['setDBQuestions', 'setGotoAnswerSheet', 'setSubjectInfo',
        'setBaseInfo', 'setAnswerSheet', 'setQuestionIndexs', 'addAnswerSheetStems']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          answerSheetApi.getAnswerQuestions(this.baseInfo.productid, this.baseInfo.userid, this.baseInfo.subsubjectid, this.baseInfo.status),
          answerSheetApi.subInfo(this.baseInfo.productid, this.baseInfo.subsubjectid)
        ]).then(this.$http.spread((answerSheet, subInfo) => {
          if (subInfo) {
            this.setSubjectInfo(subInfo)
          // 设置顶部标题
            this.setTitle(subInfo.TypeName)
          // 设置副标题
            this.setSubTitle(subInfo.Name)
          }
          let curQuestionID = 0
          if (answerSheet) {
            this.addAnswerSheetStems(answerSheet)
            if (parseInt(this.baseInfo.status) === 1) {
              // 获取最近的答题索引
              let curStem = answerSheet.filter(e => e.IsD === false)
              if (curStem.length > 0) {
                curQuestionID = curStem[0].QID
              } else {
                curQuestionID = answerSheet[answerSheet.length - 1].QID
              }
              this.$router.push({name: 'ChapterPage', query: {qid: curQuestionID, qinx: 0}})
            } else {
              this.$router.push({name: 'ChapterPage'}) // 去答题页面
            }
          }
        })).finally(() => {
          this.$vux.loading.hide()
        })
      },
      getFakeData () {
        // 获取第一批数据
        answerSheetApi.getAnswerQuestions(this.baseInfo.productid, this.baseInfo.userid, this.baseInfo.subsubjectid).then(sheets => {
          // 添加到vuex
          this.addAnswerSheetStems(sheets)
          // 去答题页面
          this.$router.push({name: 'ChapterPage'})
          this.setTitle('章节练习')
          this.setSubTitle('建筑工程')
        })
      }
    },
    created () {
      let params = querystring.parse()
      console.log(params)
      console.log('初始参数输出')
      if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
        // 如果params是空，则造点假数据
        params = {
          productid: 1,
          userid: 69031,
          subsubjectid: 239,
          skin: 'yikao',
          status: 1
        }
      }
      this.setBaseInfo(params)
      if (!process.env.HTML_Debug) {
        this.getDataFromSrv() // 从服务端获取数据
      } else {
        this.getFakeData()
      }
      // 答完题后，跳至答题卡
      this.setGotoAnswerSheet(true)
      // 答完某题干后，不自动跳转至下一题干
      this.setGoNextStemWhenFin(0)
      // 设置为刷题模式
      this.setDoExercise(true)
    }
  }
</script>

<style lang="less"  scoped>
</style>
