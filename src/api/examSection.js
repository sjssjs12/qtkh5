import request from './request'
export default{
  dataList: (examid) => {
    return request({
      url: 'ExamSection/DataList', // ?ExamId=' + this.baseInfo.examid),
      method: 'get',
      params: {
        ExamId: examid
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
