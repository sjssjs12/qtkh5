export default {
  randomBool: (trueP) => { // trueP 表示随机为true的概率
    if (!trueP) {
      trueP = 0.5
    }
    let num = Math.random()
    // console.log(num)
    if (num > (1 - trueP)) {
      return true
    } else {
      return false
    }
  },
  examSection: () => { // 生成固定的试卷结构
    return [{
      'SectionId': 28,
      'Title': '单选题',
      'QuestionIds': [7000, 7001, 7002, 7003, 7004]
    }, {
      'SectionId': 29,
      'Title': '多选题',
      'QuestionIds': [7005, 7006, 7007]
    }, {
      'SectionId': 30,
      'Title': '材料题',
      'QuestionIds': [7008, 7009]
    }]
  },
  questionIDs: (start, num) => { // 生成ID以start开始的集合，num为数量
    let qIDs = []
    for (let i = 0; i < num; i++) {
      let qid = start + i
      let stemNum = parseInt(Math.random() * 4 + 1) // 随机题干数量 1~4
      qIDs.push({
        QuestionID: qid, // 试题ID
        StemNum: stemNum // 题干数量
      })
    }
    return qIDs
  }
}
