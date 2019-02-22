'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  H5_HOST: '"http://tikuh5.wendu.com/"',
  H5_LStorageExp: '"600s"',
  HTML_Debug: true, 
  USE_MOCK: true // 使用mock数据
})
