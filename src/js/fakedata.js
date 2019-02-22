let genAnswersheet = function () {
  // 方便前端开发测试使用
  // 创建答题卡
  let answersheet = {
    ElapsedMinutes: 0,
    SheetItems: []
  }
  let inx = 0
  for (var qid = 0; qid < 10; qid++) {
    let num = parseInt(Math.random() * 4 + 1) // 随机题干数量
    for (var ainx = 0; ainx < num; ainx++) {
      let item = {
        'IsD': false,
        'P': 4,
        'S': 0,
        'IsC': false,
        'IsM': false,
        'Inx': inx++,
        'T': 100,
        'QInx': ainx,
        'QID': 7000 + qid,
        'GpInx': 1,
        'No': 1,
        'UIs': [],
        'IsS': false
      }
      // 是否主观题
      let optnum = parseInt(Math.random() * 10)
      if (optnum > 7) {
        item.IsS = true
      }
      answersheet.SheetItems.push(item)
    }
  }
  return answersheet
}

// 由试题数据生成答题卡
let getAnswerSheetFromQ = function (questions) {
  let retval = []
  let inx = 0
  questions.forEach(e => {
    e.Stems.forEach(e1 => {
      let item = {
        'IsD': false,
        'P': 0,
        'S': 0,
        'IsC': false,
        'IsM': false,
        'Inx': inx++,
        'T': 0,
        'QInx': e1.Index,
        'QID': e.QuestionID,
        'GpInx': 1,
        'No': inx + 1,
        'UIs': [],
        'IsS': e1.Options.length === 0
      }
      retval.push(item)
    })
  })
  return retval
}

let genDBquestions = function (aSheet, qIndexs) {
  // 根据答题卡，生成对应的测试用数据
  let DB = []
  let gindex = 1
  let database = require('../db')
  qIndexs.forEach((e, i) => {
    var q = JSON.parse(JSON.stringify(database.db.Data.Questions[0]))
    q.QuestionID = e
    let num = parseInt(Math.random() * 10) // 随机确定是否有材料
    if (num > 1) {
      q.References = (i + 1) + ':' + q.References
    } else {
      q.References = ''
    }
    let items = aSheet.SheetItems.filter(e1 => e1.QID === e)
    q.Stems = q.Stems.slice(0, items.length)
    q.Stems.forEach((e1, i1) => {
      e1.Content = q.QuestionID + '_' + i1 + '_' + gindex++ + e1.Content
      let num1 = parseInt(Math.random() * q.Stems.length + 1) // 随机答案数量
      if (items[i1].IsS) {
        e1.Options = []
        return true
      }
      let ainx = []
      while (num1 > 0) {
        let num2 = parseInt(Math.random() * q.Stems.length)
        if (ainx.indexOf(num2) === -1) {
          ainx.push(num2)
          num1--
        }
      }
      e1.AnswerOptionsIndexs = ainx.sort()
    })
    DB.push(q)
  })
  return DB
}
let genQuestionIndexs = function (sheet) {
  // 根据答题卡里的数据，生成试题ID列表
  let questionIndexs = []
  sheet.SheetItems.forEach((e, i) => {
    if (questionIndexs.indexOf(e.QID) === -1) {
      questionIndexs.push(e.QID)
    }
  })
  return questionIndexs
}
// 由试题数据生成虚拟答题卡
let getAnswerSheetFake = function (IdsCount) {
  let retval = []
  let inx = 0
  IdsCount.forEach(e => {
    for (var i = 0; i < e.StemCount; i++) {
      let item = {
        'IsD': false,
        'P': 0,
        'S': 0,
        'IsC': false,
        'IsM': false,
        'Inx': inx++,
        'T': 0,
        'QInx': i,
        'QID': e.QuestionId,
        'GpInx': 1,
        'No': i + 1,
        'UIs': [],
        'IsS': false
      }
      retval.push(item)
    }
  })
  return retval
}
// 重新渲染答题卡
let getAnswerSheetReload = function (aSheet, qid) {
  let answersheet = {
    ElapsedMinutes: 0,
    SheetItems: []
  }
  let inx = 0
  aSheet.SheetItems.forEach((e, i) => {
    if (e.QID !== qid) {
      let item = {
        'IsD': false,
        'P': 0,
        'S': 0,
        'IsC': false,
        'IsM': false,
        'Inx': inx++,
        'T': 0,
        'QInx': e.QInx,
        'QID': e.QID,
        'GpInx': 1,
        'No': i + 1,
        'UIs': [],
        'IsS': false
      }
      answersheet.SheetItems.push(item)
    }
  })
  return answersheet
}

export {genAnswersheet, genDBquestions, genQuestionIndexs, getAnswerSheetFromQ, getAnswerSheetFake, getAnswerSheetReload}
