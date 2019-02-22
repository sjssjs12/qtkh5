// import Mock from 'mockjs'
// import { querystring } from 'vux'
import baseMock from './baseMock'

export default {
  dataList: (w) => {
    // w : {url: "http://tikuh5.wendu.com/ExamSection/DataList?ExamId=15", type: "GET", body: null}
    // 解析地址里的参数
    // let param = querystring.parse(w.url.substring(w.url.indexOf('?')))
    let info = baseMock.examSection()
    return {
      code: 1,
      obj: info
    }
  }
}
