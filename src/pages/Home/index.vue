<template>
  <div class="box">   
    <router-link :to="{ name: 'ExamQuestion' }" replace>试卷答题</router-link>
    <br/>
    <router-link :to="{ name: 'Analysis' }" replace>试卷解析</router-link>
    <br/>
    <router-link :to="{ name: 'Collection' }" replace>收藏</router-link>
    <br/>
    <router-link :to="{ name: 'ReportPage' }" replace>报告</router-link>
    <br/>
    <router-link :to="{ name: 'SharePage' }" replace>分享页</router-link>
    <br/>
    <router-link :to="{ name: 'TestNotePage' }" replace>笔记</router-link>
    <br/>
    <router-link :to="{ name: 'WrongBook' }" replace>错题</router-link>
    <br/>
    <router-link :to="{ name: 'Page404' }" replace>404</router-link>
    <br/>
    <router-link :to="{ name: 'Chapter' }" replace>章节练习</router-link>
    <br/>
    <router-link :to="{ name: 'ChapterCollection' }" replace>章节收藏</router-link>
    <br/>
    <router-link :to="{ name: 'ChapterWrong' }" replace>章节错题</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>
<style lang="less" scoped>
</style>
