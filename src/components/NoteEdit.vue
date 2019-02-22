<template>
  <div>
  <group class="note-editor">
    <cell :title="title" is-link @click.native="gonoteAPP"></cell>
  </group>
  <load-more tip="正在加载" v-show="showLoading"></load-more>
  <p class="note-text" v-html="notedata.Content"></p>
  </div>
</template>

<script>
  import { LoadMore } from 'vux'
  import { mapGetters } from 'vuex'
  import qtkutils from '../js/qtkutils'
  export default {
    name: 'noteEdit',
    props: ['qdata'],
    components: {
      LoadMore
    },
    data () {
      return {
        title: '笔记:',
        notedata: {},
        defaultData: {
          NotesID: 0,
          Content: ''
        },
        nodata: {
          NotesID: 0,
          Content: '暂无笔记'
        },
        showLoading: false
      }
    },
    computed: {
      ...mapGetters('qModule', ['doRefreshNote', 'baseInfo', 'curQuestionID'])
    },
    watch: {
      qdata () {
        this.showNote()
      },
      doRefreshNote () {
        if (this.curQuestionID === this.qdata.QuestionID) {
          this.refreshnote()
          console.log(`试题 ${this.qdata.QuestionID} 的笔记刷新了`)
        }
      }
    },
    methods: {
      showNote (cache = true) {
        this.notedata = this.defaultData
        if (!this.qdata || !this.qdata.QuestionID) return
        this.showLoading = true
        // 获取具体笔记数据
        qtkutils.getLocalNote(this.qdata.QuestionID, this.baseInfo.userid, this.baseInfo.productid, (data, db) => {
          if (data.qid !== this.qdata.QuestionID) return // 回调时，判断回调的数据是否是当前试题的数据
          if (data.data && data.data.NotesID > 0) {
            this.notedata = data.data
          } else {
            this.notedata = this.nodata
          }
          this.showLoading = false
        }, cache)
      },
      gonoteAPP () {
        console.log('调用原生APP添加笔记,试题ID:' + this.qdata.QuestionID)
        if (window.jsbridge) {
          window.jsbridge.editUserNote(this.qdata.QuestionID, this.notedata.NotesID, this.notedata.Content)
        }
        if (window.webkit) {
          var dict = {QuestionID: this.qdata.QuestionID, NotesID: this.notedata.NotesID, Content: this.notedata.Content}
          window.webkit.messageHandlers.editUserNote.postMessage(dict)
        }
      },
      refreshnote () {
        if (this.qdata.QuestionID === this.curQuestionID || this.curQuestionID === 0) {
          this.showNote(false)
        }
      }
    },
    created () {
      // window.winfun_refreshnote = this.refreshnote
    },
    mounted () {
      this.showNote()
    }
  }
</script>

<style lang="less" scoped>
.note-editor {
  .weui-cells {
    background: #fff;
    margin-top: 0;
  }
  .weui-cell{
    background: #fff;
  }
  .weui-cells:before{
    border-top:none;
  }
  .weui-cells:after{
    border-bottom:none
  }
}
.note-text{
  padding: 5px 15px;
  font-size: 15px;
  background: #fff;
}
.ObtainMaterial {
  .note-editor{
    background: #eee;
    .weui-cell{
      background: #eee;
    }
  }
  .note-text{
    background: #eee;
  }
}
</style>
