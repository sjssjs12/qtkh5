/**
 * 工程通用类
 * */
import sdlocalstorage from './sdlocalstorage'
import axios from 'axios'
import CryptoJS from 'crypto-js'
let qtkutils = function () {
  let qKeyPre = 'qtk:qid:'
  let noteKeyPre = 'qtk:note:'
  const key = CryptoJS.enc.Utf8.parse('125410211ABCCDEF')  // 十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412')   // 十六位十六进制数作为密钥偏移量
  // 组件初始化
  function init () {

  }
  // 根据试题ID集合获取试题
  function getLocalQuestion (questionid, userid, productid, callback) {
    let retval = {
      qid: questionid,
      data: {}
    }
    let a = sdlocalstorage.get(qKeyPre + questionid)
    if (a) {
      retval.data = a
      callback(retval)
    } else {
      let log = `需要求服务器端获取数据，ID：${questionid}`
      if (window.jsbridge && process.env.APP_Debug) {
        // window.jsbridge.toast(log)
      } else {
        console.log(log)
      }
      if (window.jsbridge) {
          // window.jsbridge.toast(log)
      } else {
        console.log(log)
      }
      axios.get(process.env.H5_HOST + 'Question/GetList?UserId=' + userid + '&ProductId=' + productid + '&IDs=' + questionid).then(({data}) => {
        if (data.code === 1) {
          if (data.obj.length > 0) {
            retval.data = data.obj[0]
            callback(retval)
            saveLocalQuestion(data.obj)
          }
        }
      })
    }
  }
  function saveLocalQuestion (questions) {
    if (!questions) return
    questions.forEach(e => {
      sdlocalstorage.save(qKeyPre + e.QuestionID, e, process.env.H5_LStorageExp)
    })
  }
  function updateCollection (questionID, issFavorited) {
    let qs = sdlocalstorage.get(qKeyPre + questionID)
    qs.IsFavorited = issFavorited
    console.log(qs)
    sdlocalstorage.save(qKeyPre + questionID, qs, process.env.H5_LStorageExp)
  }
  function getCurrentQuestion (questionID, callback) {
    let qs = sdlocalstorage.get(qKeyPre + questionID)
    callback(qs)
  }
  function savelocalNote (questionid, userid, note) {
    sdlocalstorage.save(`${noteKeyPre}${questionid}:${userid}`, note, process.env.H5_LStorageExp)
  }
  function getLocalNote (questionid, userid, productid, callback, cache = true) {
    let cachekey = `${noteKeyPre}${questionid}:${userid}`
    let retval = {
      qid: questionid,
      data: null
    }
    let note = sdlocalstorage.get(cachekey)
    if (note && cache) {
      retval.data = note
      callback(retval)
    } else {
      let log = `需要求服务器端获取数据，ID：${cachekey}`
      if (window.jsbridge && process.env.APP_Debug) {
        // window.jsbridge.toast(log)
      } else {
        console.log(log)
      }
      if (!process.env.HTML_Debug) {
        axios.get(process.env.H5_HOST + 'UserNote/GetNote?QuestionId=' + questionid + '&ProductId=' + productid + '&UserId=' + userid)
          .then(({data}) => {
            if (data.code === 1) {
              retval.data = data.obj
              callback(retval)
              savelocalNote(cachekey, data.obj, process.env.H5_LStorageExp)
            }
          })
      } else {
        // html端调试时，假数据
        setTimeout(() => {
          retval.data = {
            NotesID: 0,
            Content: `${questionid}的笔记`
          }
          let a = parseInt(Math.random() * 10)
          if (a > 5) {
            retval.data = null // 随机产生无数据
          }
          callback(retval)
        }, 2000)
      }
    }
  }
  // 解密
  function Decrypt (word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }

  // 加密
  function Encrypt (word) {
    let srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.ciphertext.toString().toUpperCase()
  }
  return {
    init: init, // 组件初始化
    getLocalQuestion: getLocalQuestion,     // 根据题ID集合获取试题
    saveLocalQuestion: saveLocalQuestion,   // 保存试题数据到local
    updateCollection: updateCollection,     // 更新收藏
    getCurrentQuestion: getCurrentQuestion, // 获取当前试题
    savelocalNote: savelocalNote,         // 保存某用户某试题的笔记
    getLocalNote: getLocalNote,            // 获取某用户某试题的笔记
    Decrypt,                               // 解密
    Encrypt                               // 加密
  }
}
export default qtkutils()
