/*!
 * Copyright (C) Corporation. All rights reserved.
 *
 * Author      :  lihaitao
 * Email        : lhtzbj12@126.com
 * Create Date  : 2017-10-18
 * Description  : localstorage 操作工具 、支持过期处理、Key批量删除已过期等
 * Version      : V1.0.0
 *
 * Revision History:
 *      Date         Author               Description
 *      2017-10-18   lihaitao             完成第一版本
 *      2018-07-11   lihaitao             支持模块
 *
 */
var sdlocalstorage = function () {
  var lstorage = window.localStorage
  var gprefix = 'sdlocal:'
  // 保存传入key data 多长时间过期，默认不过期
  function save (dkey, data, expires) {
    if (!lstorage) return false
    dkey = gprefix + dkey
    expires = calculateExpiration(expires)
    var expiretime = 0 // 不过期
    if (expires) {
      expiretime = expires
    }
    var obj = {sdata: data, exp: expiretime}
    // 保存
    try {
      lstorage[dkey] = JSON.stringify(obj)
      return true
    } catch (e) {
      if (e.code === 22) {
        // 如果是localstorage满了，则进行清除
        clear()
      }
      console.error(e)
      return false
    }
  }

  // 获取过期或者不存在都返回 ''
  function get (dkey) {
    if (!lstorage) return ''
    var fullkey = gprefix + dkey
    var str = lstorage[fullkey]
    if (str) {
      try {
        var obj = JSON.parse(str)
        // 判断是否过期
        var now = new Date().getTime()
        if (obj.exp && (obj.exp === 0 || obj.exp > now)) {
          // console.log('key:' + fullkey + ',离过期还有 ' + (obj.exp - now) / 1000 + ' 秒')
          return obj.sdata
        } else {
          // 过期则删除
          remove(dkey)
        }
      } catch (e) {
        console.error(e)
        return ''
      }
    }
    return ''
  }

  // 清除所有
  function clear () {
    if (!lstorage) return
    lstorage.clear()
  }

  // 清除我的数据
  function clearMine () {
    if (!lstorage) return
    let waitClear = []
    for (let i = 0; i < lstorage.length; i++) {
      let key = lstorage.key(i)
      let index = key.indexOf(gprefix)
      if (index > -1) {
        waitClear.push(key)
      }
    }
    waitClear.forEach(e => {
      lstorage.removeItem(e)
    })
  }

  // 清除单条
  function remove (dkey) {
    if (!lstorage) return
    dkey = gprefix + dkey
    lstorage.removeItem(dkey)
  }

  // 清除过期，传入key前辍，则只除以prefix开始已经过期的数据
  function removeexp (prefix) {
    if (!lstorage) return
    let waitremove = []
    for (var i = 0; i < lstorage.length; i++) {
      var key = lstorage.key(i)
      // 如果prefix有值，则只处理前辍相同的
      var fullprefix = gprefix + prefix
      var prefixi = key.indexOf(fullprefix)
      if (!prefix || prefixi === 0) {
        waitremove.push(key.substring(gprefix.length))
      }
    }
    waitremove.forEach(e => {
      get(e)
    })
  }

  // 检测浏览器是否支持
  function test () {
    if (lstorage) {
      return true
    } else {
      return false
    }
  }

  // 计算过期时间
  function calculateExpiration (cookieExpire) {
    if (cookieExpire === null || typeof cookieExpire === 'undefined') {
      return null
    }
    var total = 0
    var time = cookieExpire.replace(/[0-9]*/, '') // s,mi,h,d,m,y
    cookieExpire = cookieExpire.replace(/[A-Za-z]{1,2}/, '') // number
    switch (time.toLowerCase()) {
      case 's':
        total = cookieExpire
        break
      case 'mi':
        total = cookieExpire * 60
        break
      case 'h':
        total = cookieExpire * 60 * 60
        break
      case 'd':
        total = cookieExpire * 24 * 60 * 60
        break
      case 'm':
        total = cookieExpire * 30 * 24 * 60 * 60
        break
      case 'y':
        total = cookieExpire * 365 * 24 * 60 * 60
        break
      default:
        total = cookieExpire
        break
    }
    var d = new Date().getTime()
    total = d + total * 1000
    return total
  }

  return {
    // 检测是否支持
    test: test,
    // 保存传入key data 多长时间过期，默认不过期，单位 s(秒) mi(分钟) h（小时） d(天) m(月) y(年)
    // 成功返回true,或者false
    save: save,
    // 获取，不存在或者过期 返回 ''
    get: get,
    // 根据key删除
    remove: remove,
    // 删除已经过期的 传入key前辍，则只除以prefix开始已经过期的数据
    removeexp: removeexp,
    // 清除所有
    clear: clear,
    // 清除我的业务范畴里的数据
    clearMine: clearMine
  }
}
export default sdlocalstorage()
