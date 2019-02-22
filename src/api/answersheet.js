// import sdlocalstorage from '../js/sdlocalstorage'
import request from './request'
// let qKeyPre = 'qtk:qid:'
// function saveLocalQuestion (questions) {
//   if (!questions) return
//   questions.forEach(e => {
//     sdlocalstorage.save(qKeyPre + e.QuestionID, e, process.env.H5_LStorageExp)
//   })
// }
export default {
  // 获取一批新数据
  getAnswerQuestions: (productid, userid, subsubjectid, status) => {
    let url = 'QuestionSheet/BeginAnswer' // 开始做题
    console.log('答题状态判断')
    console.log(status)
    console.log(parseInt(status) === 1)
    if (parseInt(status) === 1) {
      url = 'QuestionSheet/GoOnAnswer' // 继续做题
    }
    return request({
      url: url,
      method: 'get',
      params: {
        ProductId: productid,
        UserId: userid,
        SubjectId: subsubjectid
      }
    }).then((data) => {
      console.log(data)
      return Promise.resolve(data.obj)
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  getGoAnotherQuestions: (productid, userid, subsubjectid) => { // 再来一组
    return request({
      url: 'QuestionSheet/GoAnother',
      method: 'get',
      params: {
        ProductId: productid,
        UserId: userid,
        SubjectId: subsubjectid
      }
    }).then((data) => {
      console.log(data)
      return Promise.resolve(data.obj)
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  getClear: (productid, userid, subsubjectid) => { // 清空重做
    return request({
      url: 'QuestionSheet/ClearGet',
      method: 'get',
      params: {
        ProductId: productid,
        UserId: userid,
        SubjectId: subsubjectid
      }
    }).then((data) => {
      console.log(data)
      return Promise.resolve(data.obj)
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  subInfo: (productid, subsubjectid) => {
    return request({
      url: 'QuestionSheet/SubInfo', // ?ExamId=' + this.baseInfo.examid),
      method: 'get',
      params: {
        SubSubjectId: subsubjectid,
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
  }
}
