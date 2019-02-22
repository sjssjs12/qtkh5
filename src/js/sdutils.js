
/* 判断两个数组是否相等 */
let arrayEqual = function (arr1, arr2) {
  if (!arr1 || !arr2) {
    return false
  }
  if (arr1.length !== arr2.length) {
    return false
  }
  for (var i = 0, l = arr1.length; i < l; i++) {
    // Check if we have nested arrays
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arr1[i].equals(arr2[i])) {
        return false
      }
    } else if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

/* 将int数组转成字母 */
// 将数字数组转成字母数组
let ints2Chars = function (ints) {
  let chars = []
  ints.forEach(e => {
    chars.push(String.fromCharCode(e + 65))
  })
  return chars
}

// 是否是数组
let isArray = function (array) {
  return typeof array === 'object' && !isNaN(array.length)
}

export {arrayEqual, ints2Chars, isArray}
