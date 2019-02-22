import request from './request'
import { querystring } from 'vux'
export default{
  getListIds: (refId, productid, userid, opertype) => {
    return request({
      url: '/UserCollection/GetListIds', // ?RefId=' + this.baseInfo.examid + '&ProductId=' + this.baseInfo.productid + '&UserId=' + this.baseInfo.userid
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
  collectionAdd: (userid, productid, questionid, refId, optype) => {
    return request({
      url: '/UserCollection/Add',
      method: 'post',
      data: querystring.stringify({
        UserId: userid,
        ProductId: productid,
        QuestionId: questionid,
        RefId: refId,
        OpType: optype
      })
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
  collectionRemove: (questionid, productid, userid) => {
    return request({
      url: '/UserCollection/Delete', // ?Id=' + questionid + '&ProductId=' + this.baseInfo.productid + '&UserId=' + this.baseInfo.userid
      method: 'get',
      params: {
        Id: questionid,
        ProductId: productid,
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
