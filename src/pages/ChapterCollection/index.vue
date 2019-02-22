<template>
  <div>   
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  // import qktutils from '../../js/qtkutils'
  import { querystring } from 'vux'
  import userCollAPI from '@/api/userCollection'
  import answerSheetApi from '@/api/answersheet'
  export default {
    name: 'ChapterCollection',
    data () {
      return {}
    },
    computed: {
      ...mapGetters('qModule', ['dbQuestions', 'baseInfo', 'answerSheet', 'questionIndexs'])
    },
    methods: {
      ...mapActions('uiModule', ['setTitle', 'setSubTitle', 'setShowAnswerSheetBtn', 'setShowAnalysis',
        'setShowUserAnswerText']),
      ...mapActions('qModule', ['setDBQuestions', 'setRemoveCollection', 'setSubjectInfo', 'setBaseInfo',
        'setAnswerSheet', 'setQuestionIndexs', 'setStemTotal', 'addAnswerSheetStems']),
      getDataFromSrv () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.$http.all([
          userCollAPI.getListIds(this.baseInfo.subsubjectid, this.baseInfo.productid, this.baseInfo.userid, 1),
          answerSheetApi.subInfo(this.baseInfo.productid, this.baseInfo.subsubjectid)
        ]).then(this.$http.spread((ids, subInfo) => {
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
          if (subInfo) {
            this.setSubjectInfo(subInfo)
          // 设置顶部标题
            this.setTitle('收藏试题')
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
          this.setTitle('收藏试题')
          // 设置副标题
          this.setSubTitle('科目名称')
        })
      }
    },
    created () {
      let params = querystring.parse()
      if (JSON.stringify(params) === '{}' && !process.env.HTML_Debug) {
        // 如果params是空，则造点假数据
        params = {
          productid: 11,
          userid: 69031,
          subsubjectid: 586,
          status: 0
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
