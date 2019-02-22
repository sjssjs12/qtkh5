import sdlocalstorage from '../js/sdlocalstorage'
import request from './request'
import store from '../store'
import { querystring } from 'vux'

let qKeyPre = 'qtk:qid:'

// 将试题数据存入localStorage
function saveLocalQuestion (questions) {
  if (!questions) return
  questions.forEach(e => {
    sdlocalstorage.save(qKeyPre + e.QuestionID, e, process.env.H5_LStorageExp)
  })
}

// 根据实际试题、题干数据，更新答题卡里的参数 如 是否主观题
function updateAnswerSheet (questions) {
  store.commit('qModule/UPDATE_ANSWERSHEET_STEM_PARAM', questions)
}

export default {
  getList: (questionid, userid, productid) => {
    let retval = {
      qid: questionid,
      data: {}
    }
    let a = sdlocalstorage.get(qKeyPre + questionid)
    if (a) {
      retval.data = a
      return Promise.resolve(retval)
    } else {
      return request({
        url: 'Question/GetList', // ?UserId=' + userid + '&ProductId=' + productid + '&IDs=' + questionid,
        method: 'get',
        params: {
          UserId: userid,
          ProductId: productid,
          IDs: questionid
        }
      }).then((data) => {
        if (data.obj.length > 0) {
          retval.data = data.obj[0]
          saveLocalQuestion(data.obj)
          updateAnswerSheet(data.obj)
          return Promise.resolve(retval)
        } else {
          return Promise.reject(new Error('获取失败'))
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    }
  },
  questionInfo: (qid) => {
    return request({
      url: 'Question/QuestionInfo',
      method: 'get',
      params: {
        qid: qid
      }
    }).then((data) => {
      return Promise.resolve(data.obj)
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  info: (qid, userid, pid) => {
    return request({
      url: 'Question/Info', // ?qid=' + this.baseInfo.questionid + '&userid=' + this.baseInfo.userid + '&pid=' + this.baseInfo.productid,
      method: 'get',
      params: {
        qid: qid,
        userid: userid,
        pid: pid
      }
    }).then((data) => {
      return Promise.resolve(data.obj)
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  submitQuestion: (userid, productid, id, qid, isCorrect, uis) => {
    return request({
      url: 'Question/SubmitQuestion', // this.baseInfo.userid, this.baseInfo.productid, this.ID, this.qdata.QuestionID, this.isCorrect, JSON.stringify(this.UIs)
      method: 'post',
      data: querystring.stringify({
        ProductId: productid,
        UserId: userid,
        ID: id,
        QID: qid,
        IsC: isCorrect,
        UIs: uis
      })
    }).then((data) => {
      return Promise.resolve(data.obj)
    }).catch(err => {
      return Promise.reject(err)
    })
  }

}
