import Mock from 'mockjs'
import questionAPI from './question'
import examAPI from './exam'
import examSectionAPI from './examSection'
import ChapterQuestionAPI from './answersheet'

Mock.setup({
  timeout: '0-600'
})

// 题目相关
Mock.mock(/\/Question\/GetList/, 'get', questionAPI.getList)
Mock.mock(/\/Question\/QuestionInfo/, 'get', questionAPI.questionInfo)

// 试卷相关
Mock.mock(/\/Exam\/ExamInfo/, 'get', examAPI.examInfo)
Mock.mock(/\/ExamSection\/DataList/, 'get', examSectionAPI.dataList)

// 章节相关
Mock.mock(/\/QuestionSheet\/BeginAnswer/, 'get', ChapterQuestionAPI.getNewBatchQuestions)
Mock.mock(/\/QuestionSheet\/ClearGet/, 'get', ChapterQuestionAPI.getNewBatchQuestions)
Mock.mock(/\/QuestionSheet\/GoAnother/, 'get', ChapterQuestionAPI.getNewBatchQuestions)
export default Mock
