import Mock from 'mockjs'
import { querystring } from 'vux'
// import mymock from './mymock'

let mockExam = function (id) {
  let examInfo = Mock.mock({
    'ExamName|1-5': id + '这是试卷名称',
    'ExamTypeName|1': ['模拟考试', '历年真题', '考前点睛'],
    'MinutesCount': '@integer(60, 120)'
  })
  return examInfo
}

export default {
  examInfo: (w) => {
    // w : {url: "http://tikuh5.wendu.com//Exam/ExamInfo?ExamId=15&ProductId=28", type: "GET", body: null}
    // 解析地址里的参数
    let param = querystring.parse(w.url.substring(w.url.indexOf('?')))
    let info = mockExam(param.ExamId)
    return {
      code: 1,
      obj: info
    }
  }
}
