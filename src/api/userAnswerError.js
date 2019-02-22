import request from './request'
export default{
  getListIds: (refId, productid, userid, opertype) => {
    return request({
      url: 'UserAnswerError/GetListIds', // ?RefId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid + '&UserId=' + this.baseInfo.userid
      method: 'get',
      params: {
        RefId: refId,
        ProductId: productid,
        UserId: userid,
        OperType: opertype
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
  answerErrorRemove: (curQuestionID, userid) => { // 试卷移除错题
    return request({
      url: '/UserAnswerError/Remove',  // ?Id=' + this.curQuestionID + '&UserId=' + this.baseInfo.userid
      method: 'get',
      params: {
        Id: curQuestionID,
        UserId: userid
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
  anserSheetErrorRemove: (curQuestionID, userid) => { // 试卷移除错题
    return request({
      url: '/QuestionSheet/Remove',  // ?Id=' + this.curQuestionID + '&UserId=' + this.baseInfo.userid
      method: 'get',
      params: {
        QID: curQuestionID,
        UserId: userid
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
