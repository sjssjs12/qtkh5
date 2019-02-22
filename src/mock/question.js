import Mock from 'mockjs'
import { querystring } from 'vux'
import baseMock from './baseMock'
import store from '../store'
const List = []
const count = 2

const baseContent = '<b>哲学</b>就是元知识、就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，<img src="https://cdn.wendu.com/live/upload/CoursePic/0/Original/20180911/20180911145400551.jpg" />把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰就是元知识、元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰元理学，即所谓大道至简。哲学任务就是对现实世界进行元理层面的把握，把多综合为一或把一区分为多，一和多都是元理。元理也要清晰表达、系统构造，这样的元理系统才适用于阐释世界或指导实践。哲学是元理，科学（以及玄学、艺术）是原理、方法、事实，元理与原理划分并非绝对，实用依据可以是：元理是需要时刻记着即时可用的元初理论，原理是可以查工具书利用的基础理论。'
// const imageUri = 'https://cdn.wendu.com/live/upload/CoursePic/0/Original/20180911/20180911145400551.jpg'

// 根据选项数量生成答案
let getAnswerOptionsIndexs = function (optnum) {
  let num1 = parseInt(Math.random() * optnum + 1) // 随机答案数量
  let ainx = []
  for (let i = 0; i < num1; i++) {
    ainx.push(i)
  }
  return ainx
}

let mockQuestion = function (qid, stemCount) {
  let question = Mock.mock({
    'IsFavorited': baseMock.randomBool(),
    'SubSubjectID': 0,
    'SubjectID': 0,
    'CollectionID': 0,
    'MaterialType': 0,
    'Templete': 31,
    'QuestionID': qid,
    'Stems': [],
    'Images': [],
    'MaterialContent': null,
    'Analysis|1-100': qid + '这是解析内容',
    'References|0-100': qid + '这是材料内容,'
  })
  if (baseMock.randomBool()) {
    // 随机是否有材料
    question.References = ''
    // 随机带图内容
    if (baseMock.randomBool()) {
      question.References = '这是试题' + qid + baseContent
    }
  }
  // 随机带图内容
  if (baseMock.randomBool()) {
    question.Analysis = '这是试题' + qid + baseContent
  }
  // 如果传入的题干数量为null，则随机生成
  let num = stemCount
  if (!num) {
    num = parseInt(Math.random() * 4 + 1) // 随机题干数量
  }
  for (let i = 0; i < num; i++) {
    let optnum = parseInt(Math.random() * 7) // 随机选项数量
    if (optnum < 2) {
      optnum = 0
    }
    let stem = Mock.mock({
      'IsHtml': baseMock.randomBool(),
      'TemplateID': 0,
      'MaterialType': 0,
      'ExamIndex': 0,
      'Index': i,
      'AnswerOptionsIndexs': getAnswerOptionsIndexs(optnum),
      'Options': [],
      'Difficulty': parseInt(Math.random() * 5 + 1),
      'MaterialContent': '',
      'Content|1-10': '这是试题' + qid + '题干' + (i + 1) + '内容'
    })
    for (let j = 0; j < optnum; j++) {
      let opt = Mock.mock({
        'IsHtml': baseMock.randomBool(),
        'Index': j,
        'Code': String.fromCharCode(j + 65),
        'Name': null,
        'Content|1-10': '这是试题' + qid + '题干' + (i + 1) + '选项' + (j + 1) + '内容'
      })
      // 随机带图题干
      if (baseMock.randomBool(0.3)) {
        opt.Content = '这是试题' + qid + '题干' + (i + 1) + '风定花犹落，鸟鸣山更幽<img src="https://cdn.wendu.com/live/upload/CoursePic/0/Original/20180911/20180911145400551.jpg" />形象地表达了动和静的辩证关系是（）'
      }
      stem.Options.push(opt)
    }
    question.Stems.push(stem)
  }
  return question
}

for (let i = 0; i < count; i++) {
  List.push(mockQuestion(7000 + i))
}

// 根据答题卡相关数据，生成试题数据
let mockQuestionFromAnswerSheet = function (qid) {
  // 从答题卡里读取试题相关信息,实际上只要读出题干数量即可，其他内容均由试题数据
  let stemCount = store.state.qModule.answerSheet.SheetItems.filter(e => e.QID === parseInt(qid)).length
  return mockQuestion(qid, stemCount)
}
export default {
  getList: (w) => {
    // w : {url: "http://tikuh5.wendu.com/Question/GetList?UserId=650814&ProductId=4&IDs=7000", type: "GET", body: null}
    // 解析地址里的参数
    let q = querystring.parse(w.url.substring(w.url.indexOf('?')))
    let qs = []
    q.IDs.split(',').forEach((e, i) => {
      // qs.push(mockQuestion(e))
      qs.push(mockQuestionFromAnswerSheet(e))
    })
    return {
      code: 1,
      obj: qs
    }
  },
  questionInfo: (w) => {
    let q = querystring.parse(w.url.substring(w.url.indexOf('?')))
    let qdata = mockQuestion(q.qid)
    return {
      code: 1,
      obj: qdata
    }
  },
  updateArticle: () => ({
    data: 'success'
  })
}
