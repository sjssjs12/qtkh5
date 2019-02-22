import Vue from 'vue'
import Router from 'vue-router'

import QuestionPage from '@/components/QuestionPage'
import AnswerSheet from '@/components/AnswerSheet'
import PracticeReport from '@/components/PracticeReport'
import QuestionTiled from '@/components/QuestionTiled'
import ChapterAnswerSheet from '@/components/ChapterAnswerSheet'
import ChapterPage from '@/components/ChapterPage'

import Home from '@/pages/Home'
import ExamQuestion from '@/pages/ExamQuestion'
import Analysis from '@/pages/Analysis'
import Collection from '@/pages/Collection'
import WrongBook from '@/pages/WrongBook'
import SharePage from '@/pages/SharePage'
import ReportPage from '@/pages/ReportPage'
import TestNote from '@/pages/TestNote'
import Page404 from '@/pages/Page404'
import Chapter from '@/pages/Chapter'
import ChapterCollection from '@/pages/ChapterCollection'
import ChapterWrong from '@/pages/ChapterWrong'

Vue.use(Router)
export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/questions',
    name: 'QuestionPage',
    component: QuestionPage
  }, {
    path: '/answersheet',
    name: 'AnswerSheet',
    component: AnswerSheet
  }, {
    path: '/examquestion',
    name: 'ExamQuestion',
    component: ExamQuestion
  }, {
    path: '/analysis',
    name: 'Analysis',
    component: Analysis
  }, {
    path: '/collection',
    name: 'Collection',
    component: Collection
  }, {
    path: '/wrongbook',
    name: 'WrongBook',
    component: WrongBook
  }, {
    path: '/sharepage',
    name: 'SharePage',
    component: SharePage
  }, {
    path: '/reportPage',
    name: 'ReportPage',
    component: ReportPage
  }, {
    path: '/report',
    name: 'PracticeReport',
    component: PracticeReport
  }, {
    path: '/notePage',
    name: 'TestNotePage',
    component: TestNote
  }, {
    path: '/note',
    name: 'QuestionTiled',
    component: QuestionTiled
  }, {
    path: '/page404',
    name: 'Page404',
    component: Page404
  }, {
    path: '/chapterAnswerSheet',
    name: 'ChapterAnswerSheet',
    component: ChapterAnswerSheet
  }, {
    path: '/chapterPage',
    name: 'ChapterPage',
    component: ChapterPage
  }, {
    path: '/chapter',
    name: 'Chapter',
    component: Chapter
  }, {
    path: '/chapterCollection',
    name: 'ChapterCollection',
    component: ChapterCollection
  }, {
    path: '/chapterWrong',
    name: 'ChapterWrong',
    component: ChapterWrong
  }]
})
