import request from './request'
import { querystring } from 'vux'
export default{
  examInfo: (examid, productid) => {
    return request({
      url: '/Exam/ExamInfo', // ?ExamId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid
      method: 'get',
      params: {
        ExamId: examid,
        ProductId: productid
      }
    }).then((data) => {
      if (data.obj) {
        return Promise.resolve(data.obj)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  getExamReport: (examrecordid) => {
    return request({
      url: '/Exam/GetExamReport', // ?ExamRecordID=' + this.baseInfo.examrecordid
      method: 'get',
      params: {
        ExamRecordID: examrecordid
      }
    }).then((data) => {
      if (data.obj) {
        return Promise.resolve(data.obj)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  getExamRecord: (examrecordid) => {
    return request({
      url: '/Exam/GetExamRecord', // ?ExamRecordID=' + this.baseInfo.examrecordid
      method: 'get',
      params: {
        ExamRecordID: examrecordid
      }
    }).then((data) => {
      if (data.obj) {
        return Promise.resolve(data.obj)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  answerSheet: (examid, userid, productid, appid, reportkey, isGoOn) => {
    let url = '/Exam/NewAnswerSheet' // 继续做题
    if (isGoOn) {
      url = 'Exam/ReloadAnswerSheet' // 重新做题
    }
    // ?ExamId=' + this.baseInfo.examid + '&UserId=' + this.baseInfo.userid + '&ProductId=' + this.baseInfo.productid + '&AppId=' + this.appid + '&ReportKey=' + this.reportkey
    return request({
      url: url,
      method: 'get',
      params: {
        ExamId: examid,
        UserId: userid,
        ProductId: productid,
        AppId: appid,
        ReportKey: reportkey
      }
    }).then((data) => {
      if (data.obj) {
        return Promise.resolve(data.obj)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  examStatus: (examid, userid, appid, reportkey) => {
    // 'Exam/ExamStatus?ExamId=' + this.baseInfo.examid + '&UserId=' + this.baseInfo.userid + '&AppId=' + this.appid + '&ReportKey=' + this.reportkey
    return request({
      url: '/Exam/ExamStatus',
      method: 'get',
      params: {
        ExamId: examid,
        UserId: userid,
        AppId: appid,
        ReportKey: reportkey
      }
    }).then((data) => {
      console.log(data)
      if (data) {
        return Promise.resolve(data.obj)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  getQuestionId: (examid, userid, productid, appid, reportkey) => {
    // Exam/GetQuestionId?RefId=' + this.baseInfo.examid + '&UserId=' + this.baseInfo.userid + '&ProductId=' + this.baseInfo.productid
    return request({
      url: '/Exam/GetQuestionId',
      method: 'get',
      params: {
        RefId: examid,
        UserId: userid,
        ProductId: productid,
        AppId: appid,
        ReportKey: reportkey
      }
    }).then((data) => {
      if (data) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  submitAnswerSheet: (examRecordID, ticker, status, sheetItems, productid, examid, userid, curQuestionID) => {
    return request({
      url: 'Exam/SubmitAnswerSheet',
      method: 'post',
      data: querystring.stringify({
        ExamRecordID: examRecordID,
        ElapsedMinutes: ticker,
        AnswerStatus: status,
        AnswerSheet: sheetItems,
        ProductId: productid,
        ExamID: examid,
        UserId: userid,
        QuestionId: curQuestionID})
    }).then((data) => {
      if (data) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error('获取失败'))
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  }
}
