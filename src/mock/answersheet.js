// import Mock from 'mockjs'
import { querystring } from 'vux'
import store from '../store'

// 生成答题卡, 传入试题数量
let mockAnswerSheet = function (qnum) {
  let existsQs = store.state.qModule.questionIndexs
  let existsItems = store.state.qModule.answerSheet.SheetItems
  // 本批第一个试题ID
  let startID = 0
  let startQID = 7000
  if (existsQs && existsQs.length > 0 && existsItems && existsItems.length > 0) {
    startQID = existsQs[existsQs.length - 1] + 1
    startID = existsItems[existsItems.length - 1].ID + 1
  }
  let list = []
  if (startQID > 7050) { // 一共不超过50题
    return list
  }

  for (let i = 0; i < qnum; i++) {
    let stemNum = parseInt(Math.random() * 4 + 1) // 随机题干数量
    for (let j = 0; j < stemNum; j++) {
      let one = {
        'ID': startID,
        'QID': startQID,
        'IsS': false,
        'IsD': false,
        'IsC': false,
        'Inx': startID,
        'QInx': j,
        'UIs': []
      }
      startID++
      list.push(one)
    }
    startQID++
  }
  return list
}

export default {
  getNewBatchQuestions: (w) => {
    // w : {url: "http://tikuh5.wendu.com/Question/GetList?UserId=650814&ProductId=4&IDs=7000", type: "GET", body: null}
    // 解析地址里的参数
    let q = querystring.parse(w.url.substring(w.url.indexOf('?')))
    console.log(q)
    let qs = mockAnswerSheet(5)
    return {
      code: 1,
      obj: qs
    }
  },
  getOldBatchQuestions: (w) => {
    // w : {url: "http://tikuh5.wendu.com/Question/GetList?UserId=650814&ProductId=4&IDs=7000", type: "GET", body: null}
    // 解析地址里的参数
    let q = querystring.parse(w.url.substring(w.url.indexOf('?')))
    console.log(q)
    let qs = mockAnswerSheet(5)
    return {
      code: 1,
      obj: qs
    }
  }
}
